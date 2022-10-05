## Why and What's Zero Knowledge Proof
### Why 
Store and calculating data on chain is so expensive, and some data are not that important to store on chain. So we have some approach for scalability. It's called **RollUp**. And Zero Knowledge Proof is one popular and potential solution for RollUp interact with chain. RollUp compress a bunch of transactions into a single proof, so we can store tons of data in only one block. But who can decide if this proof is valid? That's why we are introducing Zero Knowledge Proof.
### What
Zero Knowledge Proof is a method which can validate data without expose data and privacy. The process is super simple and clever, which will make you find how beauty math is. An example is [Yao's Millionaires' problem](https://en.wikipedia.org/wiki/Yao%27s_Millionaires%27_problem), it's so easy to understand that I even explained this to my 9 years old daughter. Hope you won't think this explanation is boring.

## Yao's Millionaires' problem
It's introduced in 1982 by computer scientist and computational theorist Andrew Yao, and can be applied on lots of cryptography and privacy problems. Now let's start.  
Once upon a time, there are 2 millionaires who's names are ***A*** and ***B***. They are the most wealthy men in this world, because they both have a little bag of coins and nobody knows the exact number. What we know is that A has ***i*** coins and B has ***j*** coins. We also know that ***1 <= ( i , j ) <= 10*** .   
![http://url/to/img.png](https://raw.githubusercontent.com/imWayneWY/web3blog/main/my-blogs/img0.png)  
One day, they want to know which one is the richest guy, but neither of them like to tell anyone how many coins do they have. Is there a way to find the answer without revealing their wealth?  
Okay, let's pause here for a couple of minutes. Do you have any idea?


