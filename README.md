# EERTREE_Visualization
A Visualization for an EERTREE Data Structure also known as a Palindromic Tree

## Design 

Features to consider

- Support changing Algorithms at runtime
    This would be using the Strategy pattern, Would need the Strategy interface to
    support all of the operations, Insert, delete, Draw, ...
    Could do a couple algorithms like Manacher's
    However Manacher's and such algorithms are meant for finding the longest palindrome
    The EERTREE is meant to find all palindromes in a string, also it is a Data structure not 
    an algorithm.
    I think we should not support this however if in the future we want to map out the specific problem "find longest palindromic substring" then we can do that

- Want to draw the Tree
    EERTREE
    Default tree has nodes in it, want to represent the
    Node (Circle and has the palindrome inside it)
    Next Edge (Edge connecting palindromes)
    Suffix Edge (Edge connecting the node to the suffix)

    Actually drawing the tree can be difficult need to get the coordinates for each node,
    Unlike a BST we can have a different amount of elements at each level
    and can add more to each level at any time.

    Want could make it easier is if we made each level a row, so adding a node would
    shift over the other nodes in the row
    All edges would need to be redrawn, We could make the lines be drawn based on the 
    possitions of the nodes
    
- Want real time updates
    The only input should be from the text box, no submit button none of that
    everytime a new character is added we insert that character into the tree
    If we add from the end it should be O(log(26)) for the alphabet
    Middle or begining we would need to redo the rest of the tree from that spot to the end
    Adding the end is most likely and most popular

    Add to end is an insert, want to show where the insert algorithm is at, so highlight the 
    nodes it visits.

    For Remove, because we have to rebuild the tree after an insert in the middle we can just remove everything rather than showing it,

    we can show the sudo code and highlight which are we are on as well.

    The animations will take time so we can set a pause time for each action, could be changed by the user. I also would like to keep all user input limited so this will be 
    as simple as possible for the user

    Each time a user types it will have an action on the tree

    How to deal with inputs from user, we can make it much easier to handle if we make 
    a queue of the inputs so we have a steady stream of commands. 
    If user types normally we should be getting a ton of character inserts, we can use the 
    queue to go through each and go through the whole diagram.
    
    What to do if the user deletes?
    Once user 
        From the end?
            delete the node, don't bother with a visual 
            delete from the end of the queue, consider using a deque

        From the middle or begining?
            delete all nodes that come after it and then rebuild everything
            Clear the queue, add everything that comes after into the queue

            What if they are deleting more than once and from different spots?
                Deleting one character is probably rare, they are probably going through 
                editing it so we can give a pause time, 5 seconds of no deleting

    
    What to do if the user inserts?
        From the end?
            Just insert, best case and most common case
            Add the character into the queue
            
        From the middle or begining?
            Worst case, Delete all nodes after and insert from there
            Clear the queue, potentially go on pause for inserting, 
            add all characters after back into the queue


- We will effectively have 3 systems
    1. The queue that handles inputs from the user
    2. The EERTREE data structure 
    3. The representation of the EERTREE data structure

    Ideally we do not want these 3 to be tightly coupled
    The queue can be decoupled easily 

    Can we Decouple the DS and the representation?

    Decoupled
        Can draw the EERTREE easily by traversing the tree from the root
        Everytime we change the tree, add or delete, we have to redraw the whole tree
        For the insert function, cannot show the the steps it takes, the steps would be inside
        the insert function.

    Tightly Coupled
        Can show the steps of insert, and can insert and delete nodes easily,
        When the EERTREE inserts or deletes, those functions would do the representation
        logic, or call something that will do the logic.
        This also makes sense if we provide the sudo code and highlight each part when 
        the DS is doing that part.
        Tightly coupled is bad for if we want to add a new algorithm, or want to make changes 
        in the future, Bad for reusability and flexibility.
        In our project we only want to visualize this EERTREE so I think the trade-offs fit

- Actually drawing the EERTREE and all visualization parts are going to be very new to me 
so I will be learning how to do all of that during the project.
    I was thinking about having all nodes be in rows and columns


# User input

There are so many inputs

    Character key press
    paste
    delete
    drag and drop
    Select
        cntrl + shift + arrow keys
    arrow keys
    cntrl + arrow keys
    

We can disable certain inputs for now an focus on what should happen for the main inputs

There is not queue or Deque DS in JavaScript but the arrays use these methods that support
them

Now how do I put the characters into a queue, How many different methods and events
to consider?

    1. Character input
        a. at the begining
        b. at the middle
        c. at the end
    2. Character Delete
        a. at the begining
        b. at the middle
        c. at the end
    3. Multiple Character input (Paste, drag and drop)
        Disabled paste and drag and drop for now
        Need to know where the caret started at so after you paste I know how much you pasted
        or dragged, drag and drop is highlighted
    4. Multiple Character delete (highlight and delete)
        Can treat each delete from start to end as single character delete
        Highlight + delete/backspace/character input/paste
    5. Cntrl z and cntl shift z will be very complicated
        Handling this is very hard i can however just process the new input completely
        or delete the whole text in the text area
        or reload the page

To know where the Character input and delete is at, we need to know

    1. The previous string before the change
    2. Caret Position
    3. For multiple insert or delete we need to know what is highlighted

The queue will steadily take elements out
Always keep the invariant of the Caret Position

Need to know where the queue is at in terms of index of the string
Also creates 2 more states, 
    1. before queue index
    2. after queue index

Does not support these yet
    1. cntrl z and alike
    2. drag and drop

Does Support
    1. Add and delete from begining, middle, and end
    2. paste
    3. highlight and delete/backspace/character input/paste

Want to keep the invariant of the 
    1. Caret position
    2. An array that is synchronized with the text area

What the data stream to the EERTREE DS should have
    1. pause
    2. resume
    3. change index - call method to delete nodes in EERTREE
    4. If at end of array have a promise to wait for new input
    5. get index
    6. the method the queue will call on repeat will be insert in EERTREE

How does the EERTREE communicate with the queue?
    the EERTREE will ask for a character to insert repeatedly, set on an interval
    if we change the index we only really want to move the index backward
    so deleting some nodes in the DS.
    I don't want the input handling, queue, and the eertree to be coupled
    the queue would need to send a message to the DS saying delete these characters
    or the queue will call a method that deletes those characters

    the pause, resume, change index will be called by the input handler


## EERTREE

Want to have insert and delete functions for our EERTREE

About EERTREE

GOing to be going over the paper on EERTREE from 2015 
Data Structure for palindrome-related algorithmic problems.
Search, counting, factorization, RNA studies, affix trees and affix arrays.

This is a tree good for preprocessing but we are using it in an online fashion
where we will be inserting and deleting as we go

Number of nodes in the directed graph equals the number of distinct palindromes
inside the string.

For n = string size and k = number of distinct characters
The algorithm needs O(n log(k)) time and O(n) space
For a random string, the expected space is O(sqrt(nk))

The Motive of the EERTREE is to find distinct subpalindromes
subpalindromes = a substring of string S that is a palindrome
it has center (l + r) / 2 and radius ((r - l + 1) / 2)
which means the length = (r - l + 1)
The raius is important because that is half the string so you can think
of a palindrome as xAx where x is a string and A is the center

Basic version supports one operation add(c) which adds c to the processed string
from the right and updates the DS. Returns the number of new palindromes that 
are in the string.



Lemma 2.1

S is a string and c is a character. Sc contains at most one palindrome 
which is not a substring of S. This new palindrome is the longest suffix-palindrome 
of Sc.

To get the number of distinct subpalindromes of S, just return the maximum
number of a node in eertree.

add(c) returns 0 or 1

each node stores the length of its palindrome.

Initialization:

2 special nodes are added
    empty string - length 0 number 0
    imaginary string - length -1 and number -1

Edges:

if c is a character, v and cvc are two nodes, then an edge labeled by c goes from v to cvc
v ->(c) cvc
edge labeled by c goes from the node 0 to the node labeled by cc if it exists.
This is why we need two initial nodes.

Each node stores edges in a dictionary, <Character, destintation Node>
this effectively labels the edge

This is similar to a trie

Suffix link is unlabeled and connects u to v if v is the longest proper 
suffix-palindrome of u


Facts:

    - A node of positive length in an eertree has exactly one incoming edge.
    - EERTREE of a string S of length n take O(n) space.
    takes at most n + 2 nodes, at most n edges, and at most n + 2 suffix links
    - For a string S of length n eertree(S) can be built online in O(nlog(k)) time    

Properties

Nodes and edges of an eertree form two weakly connected components
the tree of odd nodes rooted at -1 and the tree of even nodes rooted at 0

The tree of even nodes is a trie of right halves of even length palindromes.

Nodes and inverted suffix links of an eertree form a tree with a loop at its
root -1

The edges of an eertree constitute no cycles, odd nodes are unreachable from even ones
and vice versa. Each even/odd node can be reached by a unique path from 0/-1

The suffix link decreases the length of a node, except for node -1. So the only cycle of 
suffix links is the loop at -1. Each node has a unique suffix link and is connected
by a suffix path to the node -1. So it is a tree with a loop at the root.

Expected size of eertree is usually much smaller than n, usually O(sqrt(nk))
Whereas Tries can have n^2 size if built from the set of all suffixes of a length n string.


Implementing Add:

Need to keep an instance of a max suffix node of S
We want the max Suffix since the suffix is at the end so this also means
this is the last node in the tree but also now we can traverse the suffixes
so this is like the root of the suffix tree now we go through links up the tree

Traverse the suffix palindromes of S in order of decreasing length
For each palindrome we read its length k and compare S[s.length() - k - 1]
against the new character c until they are equal or if we get to the -1 node

That is how we get the maximum suffix-palindrome Q of Sc

Then we check if Q has an outgoing edge labeled by c
If it is then we create a new node P which is the palindrome cQc
we add 2 to the Q.len, if Q = -1 the imaginary node
then P suffix link is -1 otherwise continue traversing suffix palindromes 
of S starting with suffix link of Q

Now we have a new max Suffix 

Put the max suffixes into the stack and update the parent


Implementing Delete:

Put nodes into a stack so we can delete them with pop()
We also need to update the parent of that node, each child has one parent
so we need to store that in the Node



# Visualization

We want to visualize thise EERTREE in the canvas
When we add a new node we add that node into the canvas
    - Show the steps and nodes we visit in the getMaxSuffixPalindrome method
    Highlight those
    - Make the edges have labeled lines with arrows from the parent to the child ->
    solid line, labeled by the character
    - The suffix links will be parent to child also -> and will be dashed line

How to do this?

Represent the nodes
    - Make ovals that hold the palindrome string inside it

Represent the edges
    - Need to coordinates of the parent and child so we can make the line
    - Consider having each node hold the coordinates or have each node hold an
    object that has the coordinates

Represent the Suffix links
    - Dashed Line goes upwards

Represent the self loop for the imaginary node
    - Special only this node will have a self edge

If the canvas becomes too cluttered?
    - consider lowering the character limit from 300 to 100? 10?
    - Maybe have users scroll around
    - resize the nodes to fit in the canvas


Methods in the Visualize class will take 
    - either the node itself or just some parameters
    - Just some parameters can make some data more encapsulated
    - Sending the node itself can make it easier on the client and makes the abstraction
    better

Problems

    Canvas interface is really annoying, cannot resize it and keep the nodes
    this makes redrawing the tree after each node prefered but we are not doing that
    because then we cannot show the steps in the process

    We can lower the character limit but my testcase
    WASITACARORACATISAW
    is already too big so this is a big problem

    Canvas will not cut it looking into libraries

Library Vis.js

    looks like what I need, the network visualization is perfect

    Network Class
    Parameters

    Container
        The HTML element where the network visualization will be displayed
    Data(DataSets)
        Contains the actual information about nodes and edges, this is how we add or remove nodes and edges
    Options
        Define properties and configurations for the network likw color, edge style and physics, etc.
    
    optional inputs
    Manipulation -> Enables user iteraction for adding, deleting, or editing nodes and edges in the visualization.
    Physics -> Defines how nodes interact with each other based on physics
    Events -> event handling
    Groups -> Categorize groups of nodes and edges for custom styling or behavior

    Only optional one that we may use is the groups
    We want to put the 2 different kinds of edges into groups


    Data
        Make Data Sets
        Datasets for Nodes and edges
        Nodes need an id
        optional label, group, title, etc.

        Edges need from NodeId to NodeId
        optional id, label, arrows, color
    
    Use levels for the hierarchy so everything is nice and neat




# Citation Check this out!!

Mikhail Rubinchik, Arseny M. Shur,
EERTREE: An efficient data structure for processing palindromes in strings,
European Journal of Combinatorics,
Volume 68,
2018,
Pages 249-265,
ISSN 0195-6698,
https://doi.org/10.1016/j.ejc.2017.07.021.
(https://www.sciencedirect.com/science/article/pii/S0195669817301294)
Abstract: We propose a new linear-size data structure which provides a fast access to all palindromic substrings of a string or a set of strings. This structure inherits some ideas from the construction of both the suffix trie and suffix tree. Using this structure, we present simple and efficient solutions for a number of problems involving palindromes.
