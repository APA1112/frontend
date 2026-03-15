export interface Service {
  antennaIp: string;
  antennaMac: string;
  apName: string;
  signalStrength: string;
  type: string;
  installAddress: string;
  status: string;
  client: Client;
}

export interface Client {
  id: string | number;
  fullName: string;
  dni: string;
  phone: string;
  address: string;
  createdAt: string; // Symfony suele enviarlo en formato ISO 8601
  services?: Service[];
}

export interface CreatorUser {
  id: string;
  email: string;
}

export interface TicketComments {
  comment: string;
  CreatorUser: CreatorUser;
  createdAt: string
}

export interface Ticket {
  assignedRole: string;
  createdAt: string;
  creator: CreatorUser;
  id: string;
  priority: string;
  service: Service;
  status: string;
  subject: string;
  ticketComments: TicketComments[];
}
