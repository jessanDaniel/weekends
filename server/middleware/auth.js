import jwt, { decode } from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // * first we parse the token from the request..
    const token = req.headers.authorization.split(" ")[1];

    // * then we set a boolean to verify whether it is google token or custom token...
    const isCustomAuth = token.length < 500;

    // * now we decode the token based on the type of token...
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, "test");

      // * manually fetching the id which was set by us...
      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      //* fetching the pre-created id (sub) by google...
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
