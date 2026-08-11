import featuredNews from "../data/featuredNews";
export async function getFeaturedNews() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(featuredNews)
        }, 800)
    })
}