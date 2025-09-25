import { type IconType } from 'react-icons';

export interface IExperience {
  year: number;
  comments: string[];
}

export interface IPersonalInfo {
  name: string;
  subtitle: string;
  bio: string[];
  avatar?: string;
}

export interface ISocialItem {
  label: string;
  url: string;
  icon: IconType;
}

export type ISocialItemList = ISocialItem[];

export interface IProfile {
  personal: IPersonalInfo;
  socials: ISocialItem[];
}
