import { ALL } from '@zely-js/zely';

interface UserInfo {
  id: number;
  nickname: string;
}
export default [
  ALL<UserInfo>({
    id: 1214,
    nickname: '',
  }),
];
