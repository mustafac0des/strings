import { atom } from "recoil";

const userAtom = atom({
  key: "user-strings",
  default: null,
});

export default userAtom;
