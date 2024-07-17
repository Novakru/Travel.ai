document.getElementById('travelPlanForm').onsubmit = function(event) {
    event.preventDefault();

    var location = document.getElementById('location').value;

    // 确保发送的数据是服务器端期望的格式
    fetch('http://127.0.0.1:8000/recommend-travel-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // 确保这是服务器端期望的内容类型
        },
        body: JSON.stringify({ location: location }) // 确保这是服务器端期望的 JSON 结构
    })
    .then(response => {
        if (!response.ok) {
            // 如果响应状态码不是 2xx，打印出错误详情
            return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
    })
    .then(data => {
        // 确保服务器端返回的 JSON 结构中包含 travel_plan 或 error
        document.getElementById('travelPlanResult').innerText = data.travel_plan || data.error;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('travelPlanResult').innerText = 'Sorry, there was an error fetching the travel plan: ' + error.message;
    });
};
