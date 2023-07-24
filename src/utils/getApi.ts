import apiUrls from "./apis.json";

export const getApi = (apiName: string) => {
  const apis = apiUrls["WagesStack"];
  const wantedApi = Object.keys(apis).find((endPoint) =>
    endPoint.includes(apiName)
  )!;
  return apis[wantedApi as keyof typeof apis];
};
