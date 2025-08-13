import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sendAgentMessage } from '@/services/api';
import { connectEvents, EventMessage } from '@/services/events';
import { OnboardingProgress } from '@/types';

export default function OnboardingPage() {
	const [fullName, setFullName] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [file, setFile] = useState<File | null>(null);
	const [conversationId, setConversationId] = useState<string | undefined>();
	const [progress, setProgress] = useState<OnboardingProgress>({ status: 'NEW', steps: [
		{ id: 'details', label: 'Customer Details', completed: false },
		{ id: 'document', label: 'Document Upload', completed: false },
		{ id: 'review', label: 'Review & Decision', completed: false },
	]});
	const unsubscribeRef = useRef<() => void>();

	useEffect(() => {
		const disconnect = connectEvents({
			url: '/ws/events',
			topics: ['transactions.events', 'agent.events', 'agent.outbound'],
			onMessage: onInboundEvent,
		});
		unsubscribeRef.current = disconnect;
		return () => disconnect();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onInboundEvent = (msg: EventMessage) => {
		try {
			const value = typeof msg.value === 'string' ? JSON.parse(msg.value) : (msg.value as any);
			if (msg.topic === 'agent.outbound') {
				const status = (value as any)?.payload?.status || (value as any)?.status || (value as any)?.responseType;
				if (status === 'APPROVED') updateProgress('review', true, 'APPROVED');
				else if (status === 'SECURITY_ALERT') updateProgress('review', false, 'FRAUD_ALERT');
				else if (status === 'ERROR') updateProgress('review', false, 'REJECTED');
			}
			if (msg.topic === 'transactions.events') {
				if ((value as any)?.eventType === 'FRAUD_CHECK_STARTED') updateProgress('review', false, 'PENDING_REVIEW');
			}
		} catch {}
	};

	function updateProgress(stepId: string, completed: boolean, status?: OnboardingProgress['status']) {
		setProgress((prev: OnboardingProgress) => {
			const steps = prev.steps.map((s: { id: string; label: string; completed: boolean; error?: string }) => s.id === stepId ? { ...s, completed } : s);
			return { ...prev, steps, status: status || prev.status, lastUpdated: Date.now() };
		});
	}

	const canSubmit = useMemo(() => !!fullName && !!email, [fullName, email]);

	const startOnboarding = async () => {
		const res = await sendAgentMessage({
			targetAgentId: 'onboarding-assistant',
			actor: email,
			type: 'ONBOARDING_START',
			payload: { fullName, email }
		});
		updateProgress('details', true, 'DOCUMENT_REQUIRED');
		setConversationId((res as any)?.conversationId || undefined);
	};

	const uploadDocument = async () => {
		if (!file) return;
		await sendAgentMessage({
			targetAgentId: 'onboarding-assistant',
			actor: email,
			type: 'DOCUMENT_UPLOADED',
			payload: { documentKey: file.name, mimeType: file.type, size: file.size }
		}, conversationId);
		updateProgress('document', true, 'PENDING_REVIEW');
		await sendAgentMessage({
			targetAgentId: 'fraud-detection-engine',
			actor: email,
			type: 'FRAUD_CHECK_REQUEST',
			payload: { email, amount: 0, source: 'onboarding' }
		}, conversationId);
	};

	return (
		<div className="space-y-6">
			<section className="bg-white rounded shadow p-4">
				<h2 className="font-semibold text-lg mb-3">Customer Details</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<input className="border rounded px-3 py-2" placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
					<input className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
				</div>
				<button disabled={!canSubmit} onClick={startOnboarding} className="mt-3 bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded">Start Onboarding</button>
			</section>

			<section className="bg-white rounded shadow p-4">
				<h2 className="font-semibold text-lg mb-3">Upload Document</h2>
				<input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
				<button disabled={!file} onClick={uploadDocument} className="mt-3 bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded">Upload</button>
			</section>

			<section className="bg-white rounded shadow p-4">
				<h2 className="font-semibold text-lg mb-3">Progress</h2>
				<div className="flex flex-col gap-2">
					{progress.steps.map((s) => (
						<div key={s.id} className="flex items-center justify-between border rounded px-3 py-2">
							<div>{s.label}</div>
							<div className={s.completed ? 'text-green-600' : 'text-gray-500'}>{s.completed ? 'Completed' : 'Pending'}</div>
						</div>
					))}
				</div>
				<div className="mt-3">Status: <span className="font-medium">{progress.status}</span></div>
			</section>
		</div>
	);
} 