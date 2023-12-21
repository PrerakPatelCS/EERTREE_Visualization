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






