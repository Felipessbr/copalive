import matches from "../data/matches";

export async function getMockMatches() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(matches);
    }, 600);
  });
}