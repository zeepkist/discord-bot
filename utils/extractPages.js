export const extractPages = (string) => {
    console.debug('string', string);
    if (!string || !string.startsWith('Page ')) {
        return { currentPage: 0, totalPages: 0 };
    }
    const pages = string.split('Page ')[1].split('.')[0];
    console.debug('pages', pages);
    const [currentPage, totalPages] = pages.split(' of ');
    return {
        currentPage: Number.parseInt(currentPage),
        totalPages: Number.parseInt(totalPages)
    };
};
