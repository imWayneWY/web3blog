## Why and What's Zero Knowledge Proof
### Why 
Store and calculating data on chain is so expensive, and some data are not that important to store on chain. So we have some approach for scalability. It's called **RollUp**. And Zero Knowledge Proof is one popular and potential solution for RollUp interact with chain. RollUp compress a bunch of transactions into a single proof, so we can store tons of data in only one block. But who can decide if this proof is valid? That's why we are introducing Zero Knowledge Proof.
### What
Zero Knowledge Proof is a method which can validate data without expose data and privacy. The process is super simple and clever, which will make you find how beauty math is. An example is [Yao's Millionaires' problem](https://en.wikipedia.org/wiki/Yao%27s_Millionaires%27_problem), it's so easy to understand that I even explained this to my 9 years old daughter. Hope you won't think this explanation is boring.

## Yao's Millionaires' problem
It's introduced in 1982 by computer scientist and computational theorist Andrew Yao, and can be applied on lots of cryptography and privacy problems. Now let's start.  
Once upon a time, there are 2 millionaires who's names are **A** and **B**. They are the most wealthy men in this world, because they both have a little bag of coins and nobody knows the exact number. What we know is that A has ***i*** coins and B has ***j*** coins. We also know that ***1 <= ( i , j ) <= 10*** .   
![millionaires](https://raw.githubusercontent.com/imWayneWY/web3blog/main/my-blogs/img0.png)  
One day, they want to know which one is the richest guy, but neither of them like to tell anyone how many coins do they have. Is there a way to find the answer without revealing their wealth?  
Okay, let's pause here for a couple of minutes. Do you have any idea?

***

Okay, let's continue.  
We can prepare 10 boxes in a private room, represent how many coins does a millionaire have. The boxes can be locked and only **A** has the key.
![boxes](https://raw.githubusercontent.com/imWayneWY/web3blog/main/my-blogs/img1.png)  

Now **A** entered the room. Let's assume he has 5 coins, so his job is to put pieces of paper inside the boxes. The first five paper will be written with ***0***, and the last five paper will be written with ***1***.After doing that, he can lock the boxes and exit the room.  
Now it's **B**'s turn, **B** enter the room, and according to how many coins he has, he will choose which number represented box. For example, if he has 4 coins, he will choose the NO.4 box. And if he has 6 coins, he will choose the NO.6 box. After that, he will burn and destroy all the other boxes.
Now **B** bring this box out. **A** can use his key to open it. If the number inside is ***0***, it means **A** has more coins than **B**. If it's ***1***, it means **B**'s coins is more than or equal with **A**.  

![boxes with paper](https://raw.githubusercontent.com/imWayneWY/web3blog/main/my-blogs/img2.png)   

See? They compared their wealth without knowing each others's privacy and also avoid to show their coins to public. This is a simple but beautiful approach. Right. As a developer, you must noticed that the key is talking about RSA here. Let's implement this next time.