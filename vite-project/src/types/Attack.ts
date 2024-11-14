export interface IMissileDetails extends Document {
    speed: number;
    intercepts: string[];
    price: number;
    amount: number;
    arrivalTime: number;          
    
};

export interface Attack {
    _id: string;
    missileName: string;
    location: string;
    destination: string;
    missileDetails: any;
    status: "Launched" | "Hit" | "Intercepted"
}
