import jwt from "jsonwebtoken";

const setTokenCookie = (_id, res) => {
  const token = jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return token;
};

export default setTokenCookie;
