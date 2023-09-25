export const colorRoad = (x) => {
    let color = [
        { type: 1, color: '#ff9705' },
        { type: 2, color: '#fd05b3' },
        { type: 3, color: '#2533cc' },
        { type: 4, color: '#00c3f8' },
        { type: 5, color: '#bb7915' },
        { type: 6, color: '#a8a4a4' },
        { type: 7, color: '#fd0900' },
    ];
    let newColor = [];
    color.forEach((el) => {
        if(el.type === x){
            newColor.push(el.color);
        }
    });
    if(x === null){
        return 'rgba(29, 112, 208,0.0)';
    }
    return newColor.join("");
}