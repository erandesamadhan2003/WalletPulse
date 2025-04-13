import moment from 'moment';


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


export const prepareIncomeBarChartData = (data = []) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: moment(item?.date).format('Do MMM'),
        amount: item?.amount || 0,
        source: item?.source || 'Unknown',
    }));

    return chartData;
};
