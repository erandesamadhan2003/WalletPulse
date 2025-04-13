export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const addThousandsSeparator = (num) => {
    return num;
};

export const prepareExpenseBarCharData = (data = []) => {
    const charData = data.map((item)=>({
        category: item?.category,
        amount: item?.amount
    }))
    return charData;
}