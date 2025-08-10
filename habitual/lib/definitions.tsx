export interface Incentives {
    id: number;
    user_id: number;
    title: string;
    cost: number;
}

export interface Action {
    id: number;
    userId: string;
    type: string;
    title: string;
    reward: number;
    done: boolean;
}

export interface Pending {
    id: string;
    user_id: string;
    points: number;
    is_checked: boolean;
    action_id: number;
}