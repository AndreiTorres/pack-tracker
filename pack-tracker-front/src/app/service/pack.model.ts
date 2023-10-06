export interface Pack {
  description: string;
  width: number;
  length: number;
  weight: number;
  sender: {
    name: string;
    email: string;
  };
  receiver: {
    name: string;
    email: string;
  };
  destination: string;
  status: string;
}
