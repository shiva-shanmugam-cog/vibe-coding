export type OnboardingStatus = 'NEW' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'FRAUD_ALERT' | 'DOCUMENT_REQUIRED';

export interface CustomerProfile {
	id?: string;
	fullName: string;
	email: string;
	phone?: string;
	address?: string;
}

export interface OnboardingProgress {
	status: OnboardingStatus;
	steps: { id: string; label: string; completed: boolean; error?: string }[];
	lastUpdated?: number;
} 