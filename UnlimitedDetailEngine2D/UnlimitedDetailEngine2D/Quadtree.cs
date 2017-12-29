using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;
using System.Diagnostics;

namespace UnlimitedDetailEngine2D
{
    public class Quadtree
    {
        public static int MaxItems = 4;
        public Quadtree[] Children { get; set; }
        public List<Atom> Contents { get; set; }
        public double Width { get; protected set; }
        public double Height { get; protected set; }
        public Quadtree Parent { get; set; }
        private double midWidth;
        private double midHeight;
        public double X { get; private set; }
        public double Y { get; private set; }
        private Color? averageColor { get; set; }
        public bool IsLeaf
        {
            get
            {
                return Children == null;// && Contents != null;
            }
        }
        public Quadtree(double x, double y, double w, double h, Quadtree parent = null)
        {
            Children = null;
            Contents = new List<Atom>();
            X = x;
            Y = y;
            Width = w;
            Height = h;
            midWidth = Width / 2;
            midHeight = Height / 2;
            Parent = parent;
            averageColor = null;
        }
        public Quadtree CheckCollision(Raycast ray, out float dist)
        {
            dist = 0;
            Vector2 a, b;
            bool inThis = LineIntersectsRectangle(
                ray.Position, ray.Position + ray.Direction,
                new Rectangle((int)X, (int)Y, (int)Width, (int)Height), out a, out b);
            

            if (!inThis)
            {
                return null;
            }
            if (IsLeaf)
            {
                if (Contents.Count > 0)
                {
                    a -= ray.Position;
                    b -= ray.Position;
                    float alen = a.Length(), blen = b.Length();
                    if (alen > blen)
                    {
                        dist = blen;
                    }
                    else
                    {
                        dist = alen;
                    }
                    return this;
                }
            }
            else
            {
                int ind = inWhichChild(ray.Position.X, ray.Position.Y);
                int dir;
                if ((ind & 1) == 0)
                    dir = 1;
                else
                    dir = -1;
                for (int i = 0; i < 4; i++)
                {
                    Quadtree result = Children[ind].CheckCollision(ray, out dist);
                    if (result != null)
                    {
                        return result;
                    }
                    ind = addLoop(ind, dir, 4);
                }
            }
            return null;
        }
        private int addLoop(int val, int add, int max)
        {
            val += add;
            while (val < 0)
                val += max;
            val %= max;
            return val;
        }
        //https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm
        public static bool LineIntersectsRectangle(Vector2 a, Vector2 b, Rectangle r, out Vector2 c, out Vector2 d)
        {
            c = a;
            d = b;
            int c0 = compOutCode(a, r),
                c1 = compOutCode(b, r);
            while(true)
            {
                if((c0 | c1) == 0)
                {
                    return true;
                }
                else if((c0 & c1) != 0)
                {
                    return false;
                }
                else
                {
                    Vector2 p;
                    int co = (c0!=0) ? c0 : c1;
                    if((co & 8 /*top*/)!=0)
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

                    if(co == c0)
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
        public Color GetColor()
        {
            if(averageColor == null)
                updateColor();
            return averageColor ?? new Color(0, 0, 0, 0);
        }
        protected void updateColor()
        {
            if (IsLeaf)
            {
                Color[] cols = new Color[Contents.Count];
                for(int i = 0; i < Contents.Count; i++)
                {
                    Atom a = Contents[i];
                    cols[i] = new Color(a.R, a.G, a.B);
                }
                averageColor = blendColors(cols);
                if(Parent != null)
                {
                    Parent.updateColor();
                }
            }
            else
            {
                Color[] cols = new Color[Children.Length];
                for (int i = 0; i < cols.Length; i++)
                {
                    cols[i] = Children[i].GetColor();
                }
                averageColor = blendColors(cols);
            }
        }
        public void AddToContent(Atom item)
        {
            addToContent(item);
            ShouldSplit();
        }
        private void addToContent(Atom item)
        {
            if (IsLeaf)
            {
                Contents.Add(item);
                updateColor();
            }
            else
            {
                int chld = inWhichChild(item.X, item.Y);
                Children[chld].AddToContent(item);
            }
        }
        public void AddToContent(List<Atom> items)
        {
            if (IsLeaf)
            {
                foreach (Atom item in items)
                {
                    Contents.Add(item);
                }
                ShouldSplit();
                updateColor();
            }
            else
            {
                List<Atom>[] atoms = new List<Atom>[4];
                for (int i = 0; i < atoms.Length; i++)
                {
                    atoms[i] = new List<Atom>();
                }
                for (int i = items.Count - 1; i >= 0; i--)
                {
                    Atom item = items[i];
                    int chld = inWhichChild(item.X, item.Y);
                    atoms[chld].Add(item);
                }
                for (int i = 0; i < atoms.Length; i++)
                {
                    Children[i].AddToContent(atoms[i]);
                }
                updateColor();
            }
        }
        public void ShouldSplit()
        {
            if (Contents.Count > MaxItems)
            {
                split();
            }
        }
        private void split()
        {
            Debug.WriteLine("rawr");
            Children = new Quadtree[4];
            Children[0] = new Quadtree(X, Y, midWidth, midHeight, this);
            Children[1] = new Quadtree(midWidth, Y, Width, midHeight, this);
            Children[2] = new Quadtree(X, midHeight, midWidth, Height, this);
            Children[3] = new Quadtree(midWidth, midHeight, Width, Height, this);
            AddToContent(Contents);
            //Contents = new List<Atom>();
            Contents = null;
        }
        private int inWhichChild(double x, double y)
        {
            int val = 0;
            if (x >= X + midWidth)
                val += 1;
            if (y >= Y + midHeight)
                val += 2;
            return val;
        }
        private static Color blendColors(Color[] colors)
        {
            if(colors.Length == 0)
            {
                return new Color(0, 0, 0, 0);
            }
            int r = 0, g = 0, b = 0;
            foreach(Color col in colors)
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
    }
}
