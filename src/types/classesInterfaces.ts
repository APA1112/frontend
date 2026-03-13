export interface Service {
  antennaIp: string;
  antennaMac: string;
  apName: string;
  signalStrength: string;
  type: string;
  installAddress: string;
  status: string;
}

export interface Client {
  fullName: string;
  dni: string;
  phone: string;
  address: string;
  createdAt: string;
  services: Service[]
}