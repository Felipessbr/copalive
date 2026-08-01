
export default function groupMatches(matches) {
    return matches.reduce((groups, match) => {
        const competition = match.competition

        if (!groups[competition]) {
            groups[competition] = [];
        }

        groups[competition].push(match);

        return groups;

    }, {})
}