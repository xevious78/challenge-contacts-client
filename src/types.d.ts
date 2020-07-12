export type ContactInfos = {
  name: string;
  jobTitle?: string;
  email?: string;
  address?: string;
  phoneNumbers: [string];
};

export type Contact = { id: string } & ContactInfos;
