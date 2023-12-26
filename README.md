# EERTREE_Visualization
A Visualization for an EERTREE Data Structure also known as a Palindromic Tree
This is meant to be used as a leanring tool to understand how the Data structure works

## EERTREE

This is a relatively new data structure made in 2015. The Eertree is a Data structure
for palindrome-related algorithmic problems.
Problems like Search, counting, factorization, RNA studiesm affix trees and affix arrays.

Here are a couple problems you might recognize, see if you can think of how to use this DS.

1. https://leetcode.com/problems/longest-palindromic-substring/description/
2. https://adventofcode.com/2023/day/13
3. https://oj.uz/problem/view/APIO14_palindrome

These problems are really hard !!

The basic verison of EERTREE use has a single function add(Character c) and returns 0 or 1
based on the number of nodes it adds from adding that character.

It can be proven that If the EERTREE processed String S already then Sc will have at most
1 palindrome which is not a substring of S.

Each node in the EERTREE holds the suffix link, the length, and a map of the edges. The edges
will be similar to a Trie where we store them as Map<Character, Node>. The suffix link is an edge
that points to the biggest suffix that makes this palindrome.
This is why we have 2 root nodes, 
1. Imaginary Node or Odd Root Node, has length -1
2. Empty node or Even Root Node, has length 0


1. Number of nodes in the directed graph equals the number of distinct palindromes inside the string.
2. For n = string size and k = number of distinct characters. The algorithm needs O(n log(k)) time and O(n) space. For a random string, the expected space is O(sqrt(nk))

Other algorithms exist like Manacher's algorithm but that only finds the maximal radius in a string.

Subpalindromes = a substring of string S that is a palindrome
it has center (l + r) / 2 and radius ((r - l + 1) / 2)
which means the length = (r - l + 1)
The raius is important because that is half the string so you can think
of a palindrome as xAx where x is a string and A is the center


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

Keep track of the max suffix node of S. We will be using this node which is at the bottom
to traverse the suffix links, which point upwards to the root nodes.
We traverse those nodes via suffix links until we get the the root node or we get to
the same character we are trying to insert by checking S[S.length() - k - 1] and 
k = the node's length. Once this is true then we have the node that is a Q 
the maximum suffix-palindrome of Sc. So the new palindrome is cQc.

Implementing Delete:

We need to keep track of all the max suffix nodes at S, Sc, Scc, Sccc, ..., Sc...n. 
This way we can put them into a stack and then and restore that state. The Paper goes over 2 
ways to make add more efficient so the suffix links do not have to traverse so far.

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

## Design 

When Desiging this I wanted to have a couple of features

1. Support changing Algorithms at runtime
2. Want to draw the Tree
3. Want real time updates as you type

Supporting different algorithms would have been using the Strategy pattern but
the EERTREE is a Data structure and not solving a speific problem so we cut that out.

Effectively we have 4 parts to this project

1. Handling the input
2. Creating a consistent stream of inputs to my data structure
3. the EERTREE DS itself
4. Visualization

Each of these parts should be decoupled from each as much as possible. Want the input handling
to be nice and clean. I did not want to have a button which triggered a function to draw the
tree. Each character input is an event so I wanted real time updates like that. That system however is very complex, and I may have some bugs regardless of how hard i try to tackle them.
There are so many different ways to input and delete and drag and drop. We can cancel some of these things but want to keep most enabled and handle those events. The cntl z and those events are really hard because those do not trigger events in JavaScript. It would be really cool if this is the only input and we have realtime updates to the tree. Adding to the tree
one character at a time is fast, should be O(log(256)). People usually type characters at the 
end and delete at the end, those 2 cases are really easy and the average cases.
```
    Character key press
    paste
    delete
    drag and drop
    Select
        cntrl + shift + arrow keys
    arrow keys
    cntrl + arrow keys
``` 

This adds some edge cases 

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

We need to keep some invariant conditions 

1. The caret index
2. The previous selection
3. the current string in the text area

Because the select and delete are 2 different events we need to know what was selected previously. The caret index and current string in the text area are important for the 
queue.

Does not support:
Cntrl Z and some other cntrl functions, and all drag and drop.
If you select some text and click the selected part it does not update the previous selection


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

This library is perfect for making a graph using their network visualizations. It uses
data sets for the nodes and edges and you can add them from there. This makes drawing
the graph much easier. It also resizes if you need to and lets the user play around with it.


## Next Features to Consider

- Adding highlighting to each node to show the steps of how it inserts a character. 
- Improving the input but supporting cntrl functions and drag and drop
- there may still be some bugs so catch those and do more testing

