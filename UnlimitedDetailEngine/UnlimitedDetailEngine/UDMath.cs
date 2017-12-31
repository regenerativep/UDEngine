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
        public static bool LineIntersectsCube(Vector3 la, Vector3 lb, Vector3 ra, Vector3 rb, out Vector3 c, out Vector3 d)
        {
            Vector2 l1a, l1b, l2a, l2b, l3a, l3b;
            bool works = LineIntersectsRectangle(new Vector2(la.X, la.Y), new Vector2(lb.X, lb.Y), new Rectangle((int)ra.X, (int)ra.Y, (int)rb.X, (int)rb.Y), out l1a, out l1b);
            works = LineIntersectsRectangle(new Vector2(la.Z, la.X), new Vector2(lb.Z, lb.X), new Rectangle((int)ra.Z, (int)ra.X, (int)rb.Z, (int)rb.X), out l2a, out l2b) && works;
            works = LineIntersectsRectangle(new Vector2(la.Z, la.Y), new Vector2(lb.Z, lb.Y), new Rectangle((int)ra.Z, (int)ra.Y, (int)rb.Z, (int)rb.Y), out l3a, out l3b) && works;
            float cZ = GetClosest(la.Z, l3a.X, l3b.X);
            float dZ = GetClosest(lb.Z, l2a.X, l2b.X);
            c = new Vector3(l1a.X, l1a.Y, cZ);
            d = new Vector3(l1b.X, l1b.Y, dZ);
            return works;
        }
        /// <summary>
        /// checks if a line intersects a rectangle
        /// </summary>
        /// <param name="a">line's first coord</param>
        /// <param name="b">line's other coord</param>
        /// <param name="r">the rectangle</param>
        /// <param name="c">output of clipped line's first coord</param>
        /// <param name="d">output of clipped line's other coord</param>
        /// <returns>if the given line intersects with the given rectangle</returns>
        public static bool LineIntersectsRectangle(Vector2 a, Vector2 b, Rectangle r)
        {
            Vector2 c, d;
            return LineIntersectsRectangle(a, b, r, out c, out d);
        }
        //https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
        /// <summary>
        /// checks if a line intersects a rectangle (might be overkill at the moment)
        /// </summary>
        /// <param name="a">line's first coord</param>
        /// <param name="b">line's other coord</param>
        /// <param name="r">the rectangle</param>
        /// <param name="c">output of clipped line's first coord</param>
        /// <param name="d">output of clipped line's other coord</param>
        /// <returns>if the given line intersects with the given rectangle</returns>
        public static bool LineIntersectsRectangle(Vector2 a, Vector2 b, Rectangle r, out Vector2 c, out Vector2 d)
        {
            c = a;
            d = b;
            int c0 = compOutCode(a, r),
                c1 = compOutCode(b, r);
            while (true)
            {
                if ((c0 | c1) == 0)
                {
                    return true;
                }
                else if ((c0 & c1) != 0)
                {
                    return false;
                }
                else
                {
                    Vector2 p;
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
                    else// if ((co & 1/*left*/) != 0)
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
            //return false;
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
}
