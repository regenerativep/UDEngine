# UDEngine
trying to make an unlimited detail engine because i dont see how it can be that hard to make


each pixel rendered is from a single ray


what makes this engine (theoretically) viable is that it wont actually check for individual atoms, and it will check in upper nodes of the octtree (which contains all the atoms)


if youre closer to a node, the deeper it should push into the octtree to get more detail (not put in yet, will do once i get the basic idea working)



todo:

figure out why it doesnt do what it is supposed to be doing

like its doing things and it looks okay

but like it isnt okaymand its weird

like so the top level of the octtree does everything fine

like it looks like a cube but once it splits, weird things happen

probably something to do with the order in which it figures out which nodes to check for collision with the ray first but i havent figured it out yet


another thing: the rectangle intersecting with line code needs to be optimized

actually that could be where my issue for the previous thing is

i need to look more into it
