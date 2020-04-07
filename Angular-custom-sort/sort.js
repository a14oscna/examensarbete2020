document.getElementById("sortRandom").addEventListener("click", function(){
    const headers = document.getElementsByTagName("th");
    let t1, t2, num;
    for (let i = 0; i < 2; i++) {
        num = Math.floor(Math.random() * 13)
        t1 = performance.now();
        headers[num].click();
        t2 = performance.now();
        console.log("Sorting took " + (t2 - t1) + " milliseconds to complete.");       
    }

});