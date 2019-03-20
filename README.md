# UDEngine
it can't be that hard to make a revolutionary graphics engine within a browser, right?


this is a (log n) searching algorithm

what it finds is, given a ray, what is the atom (colored atoms instead of textured polygons) that intersects with the ray the best (best can be subjective technically, but generally it is whichever atom is closest to the ray and closest to the origin of the ray)

using that searching algorithm, you can make a ray tracer with a very important property: no matter how much complexity you add to a scene, it will not take longer to render. the only limitation is memory