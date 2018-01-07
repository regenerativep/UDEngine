using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnlimitedDetailEngine
{
    public static class UDMath
    {
        /// <summary>
        /// mixes the array of colors into a single color
        /// </summary>
        /// <param name="colors">colors to mix</param>
        /// <returns>the new color</returns>
        public static Color BlendColors(Color[] colors)
        {
            if (colors.Length == 0)
            {
                return new Color(0, 0, 0, 0);
            }
            int r = 0, g = 0, b = 0;
            foreach (Color col in colors)
            {
                r += col.R;
                g += col.G;
                b += col.B;
            }
            r /= colors.Length;
            g /= colors.Length;
            b /= colors.Length;
            return new Color(r, g, b);
        }
        /// <summary>
        /// converts degrees to radians
        /// </summary>
        /// <param name="angle">degrees to convert</param>
        /// <returns>angle in radians</returns>
        public static double DegreesToRadians(double angle)
        {
            return Math.PI * (angle % 360) / 180d;
        }
        /// <summary>
        /// calculates 2d vector, given length and direction
        /// </summary>
        /// <param name="len">length</param>
        /// <param name="dir">direction in degrees</param>
        /// <returns>2d direction vector</returns>
        public static Vector2 LengthDir(float len, float dir)
        {
            double d = DegreesToRadians(dir);
            return new Vector2(
                (float)Math.Cos(d),
                (float)Math.Sin(d)
            ) * len;
        }
        /// <summary>
        /// calculates 3d vector, given length and direction
        /// </summary>
        /// <param name="len">length</param>
        /// <param name="yaw">yaw in degrees</param>
        /// <param name="pit">pitch in degrees</param>
        /// <returns>3d direction vector</returns>
        public static Vector3 LengthDir(float len, float yaw, float pit)
        {
            double d = DegreesToRadians(yaw),
                   p = DegreesToRadians(pit);
            double zC = Math.Cos(p);
            return new Vector3(
                (float)(Math.Cos(d) * zC),
                (float)(Math.Sin(d) * zC),
                (float)(Math.Sin(p))
            ) * len;
        }
        /// <summary>
        /// gets the value closest to the given value
        /// </summary>
        /// <param name="val">the value</param>
        /// <param name="a">the first value</param>
        /// <param name="b">the second value</param>
        /// <returns></returns>
        public static float GetClosest(float val, float a, float b)
        {
            if (val < a)
            {
                if (a < b)
                {
                    return a;
                }
                else
                {
                    return b;
                }
            }
            else
            {
                if (a > b)
                {
                    return a;
                }
                else
                {
                    return b;
                }
            }
        }
        /*
         * public static bool LineIntersectsCube(Vector3 la, Vector3 lb, Vector3 ra, Vector3 rb)
        {
            return LineIntersectsRectangle(new Vector2(la.X, la.Y), new Vector2(lb.X, lb.Y), new Vector2(ra.X, ra.Y), new Vector2(rb.X, rb.Y)) &&
                LineIntersectsRectangle(new Vector2(la.Z, la.X), new Vector2(lb.Z, lb.X), new Vector2(ra.Z, ra.X), new Vector2(rb.Z, rb.X)) &&
                LineIntersectsRectangle(new Vector2(la.Z, la.Y), new Vector2(lb.Z, lb.Y), new Vector2(ra.Z, ra.Y), new Vector2(rb.Z, rb.Y));
        }
        //https://www.cdn.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
        private static bool onSegment(Vector2 p, Vector2 q, Vector2 r)
        {
            return q.X <= Math.Max(p.X, r.X) && q.X >= Math.Min(p.X, r.X) && q.Y <= Math.Max(p.Y, r.Y) && q.Y >= Math.Min(p.Y, r.Y);
        }
        private static int orientation(Vector2 p, Vector2 q, Vector2 r)
        {
            float val = (q.Y - p.Y) * (r.X - q.X) - (q.X - p.X) * (r.Y - q.Y);
            if (val == 0) return 0; //this means colinear apparently
            return (val > 0) ? 1 : 2; //cw/ccw
        }
        public static bool LineIntersectsLine(Vector2 a1, Vector2 a2, Vector2 b1, Vector2 b2)
        {
            //copy and pasted with variable name changes
            int o1 = orientation(a1, a2, b1);
            int o2 = orientation(a1, a2, b2);
            int o3 = orientation(b1, b2, a1);
            int o4 = orientation(b1, b2, a2);

            // General case
            if (o1 != o2 && o3 != o4)
                return true;

            // Special Cases
            // a1, a2 and b1 are colinear and b1 lies on segment a1a2
            if (o1 == 0 && onSegment(a1, b1, a2)) return true;

            // a1, a2 and b1 are colinear and b2 lies on segment a1a2
            if (o2 == 0 && onSegment(a1, b2, a2)) return true;

            // b1, b2 and a1 are colinear and a1 lies on segment b1b2
            if (o3 == 0 && onSegment(b1, a1, b2)) return true;

            // b1, b2 and a2 are colinear and a2 lies on segment b1b2
            if (o4 == 0 && onSegment(b1, a2, b2)) return true;

            return false; // Doesn't fall in any of the above cases
        }
        public static bool LineIntersectsRectangle(Vector2 a, Vector2 b, Vector2 ra, Vector2 rb)
        {
            bool aIn = PointInRectangle(a, ra, rb),
                 bIn = PointInRectangle(a, ra, rb);
            if (aIn || bIn)
            {
                return true;
            }
            return LineIntersectsLine(a, b, ra, new Vector2(ra.X, rb.Y))  //left
                || LineIntersectsLine(a, b, ra, new Vector2(rb.X, ra.Y))  //top
                || LineIntersectsLine(a, b, new Vector2(ra.X, rb.Y), rb)  //bottom
                || LineIntersectsLine(a, b, new Vector2(rb.X, ra.Y), rb); //right
        }
        public static bool PointInRectangle(Vector2 p, Vector2 ra, Vector2 rb)
        {
            return p.X > ra.X && p.Y > ra.Y && p.X < rb.X && p.Y < rb.Y;
        }*/
        /// <summary>
        /// checks if a line intersects with a cube
        /// </summary>
        /// <param name="la">line's first coord</param>
        /// <param name="lb">line's other coord</param>
        /// <param name="ra">cube's first coord</param>
        /// <param name="rb">cube's other coord</param>
        /// <param name="c">clipped line's first coord</param>
        /// <param name="d">clipped line's other coord</param>
        /// <returns>if the line intersects the cube</returns>
        public static LineIntersectsCubeResult LineIntersectsCube(Vector3 la, Vector3 lb, Vector3 ra, Vector3 rb)
        {
            LineIntersectsRectangleResult l1 = LineIntersectsRectangle(new Vector2(la.X, la.Y), new Vector2(lb.X, lb.Y), new Rectangle((int)ra.X, (int)ra.Y, (int)rb.X, (int)rb.Y));
            LineIntersectsRectangleResult l2 = LineIntersectsRectangle(new Vector2(la.Z, la.X), new Vector2(lb.Z, lb.X), new Rectangle((int)ra.Z, (int)ra.X, (int)rb.Z, (int)rb.X));
            LineIntersectsRectangleResult l3 = LineIntersectsRectangle(new Vector2(la.Z, la.Y), new Vector2(lb.Z, lb.Y), new Rectangle((int)ra.Z, (int)ra.Y, (int)rb.Z, (int)rb.Y));
            float cZ = GetClosest(la.Z, l3.A.X, l3.B.X);
            float dZ = GetClosest(lb.Z, l2.A.X, l2.B.X);
            return new LineIntersectsCubeResult(
                l1.Result && l2.Result && l3.Result,
                new Vector3(l1.A.X, l1.A.Y, cZ),
                new Vector3(l1.B.X, l1.B.Y, dZ)
            );
        }
        //https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
        /// <summary>
        /// checks if a line intersects a rectangle (might be overkill at the moment)
        /// </summary>
        /// <param name="a">line's first coord</param>
        /// <param name="b">line's other coord</param>
        /// <param name="r">the rectangle</param>
        /// <returns>if the given line intersects with the given rectangle</returns>
        public static LineIntersectsRectangleResult LineIntersectsRectangle(Vector2 a, Vector2 b, Rectangle r)
        {
            Vector2 c = a;
            Vector2 d = b;
            int c0 = compOutCode(a, r),
                c1 = compOutCode(b, r);
            while (true)
            {
                if ((c0 | c1) == 0)
                {
                    return new LineIntersectsRectangleResult(true, c, d);
                }
                else if ((c0 & c1) != 0)
                {
                    return new LineIntersectsRectangleResult(false, c, d);
                }
                else
                {
                    Vector2 p = new Vector2(0,0);
                    int co = (c0 != 0) ? c0 : c1;
                    if ((co & 8 /*top*/) != 0)
                    {
                        p = new Vector2(
                            a.X + (b.X - a.X) * (r.Y + r.Height - a.Y) / (b.Y - a.Y),
                            r.Y + r.Height
                        );
                    }
                    else if ((co & 4/*bottom*/) != 0)
                    {
                        p = new Vector2(
                            a.X + (b.X - a.X) * (r.Y - a.Y) / (b.Y - a.Y),
                            r.Y
                        );
                    }
                    else if ((co & 2/*right*/) != 0)
                    {
                        p = new Vector2(
                            r.X + r.Width,
                            a.Y + (b.Y - a.Y) * (r.X + r.Width - a.X) / (b.X - a.X)
                        );
                    }
                    else if ((co & 1/*left*/) != 0)
                    {
                        p = new Vector2(
                            r.X,
                            a.Y + (b.Y - a.Y) * (r.X - a.X) / (b.X - a.X)
                        );
                    }

                    if (co == c0)
                    {
                        a = p;
                        c = p;
                        c0 = compOutCode(a, r);
                    }
                    else
                    {
                        b = p;
                        d = p;
                        c1 = compOutCode(b, r);
                    }
                }
            }
        }
        private static byte compOutCode(Vector2 p, Rectangle rect)
        {
            byte code = 0;
            /* 0 0000 inside
             * 1 0001 left
             * 2 0010 right
             * 4 0100 bottom
             * 8 1000 top
             */
            if (p.X < rect.X)
                code |= 1;
            else if (p.X > rect.X + rect.Width)
                code |= 2;
            if (p.Y < rect.Y)
                code |= 4;
            else if (p.Y > rect.Y + rect.Height)
                code |= 8;
            return code;
        }
    }
    public class LineIntersectsRectangleResult
    {
        public bool Result { get; set; }
        public Vector2 A { get; set; }
        public Vector2 B { get; set; }
        public LineIntersectsRectangleResult(bool res, Vector2 a, Vector2 b)
        {
            Result = res;
            A = a;
            B = b;
        }
    }
    public class LineIntersectsCubeResult
    {
        public bool Result { get; set; }
        public Vector3 A { get; set; }
        public Vector3 B { get; set; }
        public LineIntersectsCubeResult(bool res, Vector3 a, Vector3 b)
        {
            Result = res;
            A = a;
            B = b;
        }
    }
}
