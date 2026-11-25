import { Share } from 'react-native';

export const shareTeam = async (id: string, name: string): Promise<void> => {
  await Share.share({
    message: `Check out ${name} on Scoreline!\nscoreline://team/${id}`,
    url: `scoreline://team/${id}`,
    title: name,
  });
};

export const shareLeague = async (
  id: string,
  name: string,
): Promise<void> => {
  await Share.share({
    message: `Check out the ${name} league on Scoreline!\nscoreline://league/${id}`,
    url: `scoreline://league/${id}`,
    title: name,
  });
};

export const sharePlayer = async (
  id: string,
  name: string,
): Promise<void> => {
  await Share.share({
    message: `Check out ${name} on Scoreline!\nscoreline://player/${id}`,
    url: `scoreline://player/${id}`,
    title: name,
  });
};
