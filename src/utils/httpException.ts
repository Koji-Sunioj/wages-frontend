export const handleException = async (request: Response) => {
  const response = await request.json();
  if (!request.ok) {
    const message =
      response.hasOwnProperty("detail") && typeof response.detail === "string"
        ? response.detail
        : request.statusText;
    throw new Error(message);
  }
  return response;
};
