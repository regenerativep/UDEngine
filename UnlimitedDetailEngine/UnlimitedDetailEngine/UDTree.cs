using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xna.Framework;

namespace UnlimitedDetailEngine
{

    /// <summary>
    /// unlimited detail octtree
    /// </summary>
    public class UDTree
    {
        /// <summary>
        /// max items per leaf
        /// </summary>
        public static int MAX_ITEMS = 4;
        /// <summary>
        /// child nodes
        /// </summary>
        public UDTree[] Children { get; set; }
        /// <summary>
        /// contents of this leaf node
        /// </summary>
        public List<UDAtom> Contents { get; set; }
        /// <summary>
        /// width of this tree
        /// </summary>
        public double Width { get; protected set; }
        /// <summary>
        /// height of this tree
        /// </summary>
        public double Height { get; protected set; }
        /// <summary>
        /// length of this tree
        /// </summary>
        public double Length { get; protected set; }
        /// <summary>
        /// parent of this tree
        /// </summary>
        public UDTree Parent { get; set; }
        /// <summary>
        /// Width / 2
        /// </summary>
        private double midWidth { get; set; }
        /// <summary>
        /// Height / 2
        /// </summary>
        private double midHeight { get; set; }
        /// <summary>
        /// Length / 2
        /// </summary>
        private double midLength { get; set; }
        /// <summary>
        /// x position
        /// </summary>
        public double X { get; private set; }
        /// <summary>
        /// y position
        /// </summary>
        public double Y { get; private set; }
        /// <summary>
        /// z position
        /// </summary>
        public double Z { get; private set; }
        /// <summary>
        /// the average color of this tree
        /// </summary>
        private Color? averageColor { get; set; }
        /// <summary>
        /// if this node is a leaf node
        /// </summary>
        public bool IsLeaf
        {
            get
            {
                return Children == null;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="x"></param>
        /// <param name="y"></param>
        /// <param name="z"></param>
        /// <param name="w"></param>
        /// <param name="h"></param>
        /// <param name="l"></param>
        /// <param name="parent"></param>
        public UDTree(double x, double y, double z, double w, double h, double l, UDTree parent = null)
        {
            Children = null;
            Contents = new List<UDAtom>();
            X = x;
            Y = y;
            Z = z;
            Width = w;
            Height = h;
            Length = l;
            midWidth = Width / 2;
            midHeight = Height / 2;
            midLength = Length / 2;
            Parent = parent;
            averageColor = null;
        }
        public Color GetColor()
        {
            if(averageColor == null)
            {
                updateColor();
            }
            return averageColor ?? new Color(0, 0, 0, 0);
        }
        protected void updateColor()
        {
            if(IsLeaf)
            {
                Color[] cols = new Color[Contents.Count];
                for(int i = 0; i < Contents.Count; i++)
                {
                    UDAtom a = Contents[i];
                    cols[i] = new Color(a.R, a.G, a.B);
                }
                averageColor = UDMath.BlendColors(cols);
                if(Parent != null)
                {
                    Parent.updateColor();
                }
            }
            else
            {
                Color[] cols = new Color[Children.Length];
                for(int i = 0; i < cols.Length; i++)
                {
                    cols[i] = Children[i].GetColor();
                }
                averageColor = UDMath.BlendColors(cols);
            }
        }
        public void AddToContent(UDAtom item)
        {
            addToContent(item);
            ShouldSplit();
        }
        private void addToContent(UDAtom item)
        {
            if (IsLeaf)
            {
                Contents.Add(item);
                updateColor();
            }
            else
            {
                int chld = inWhichChild(item.X, item.Y, item.Z);
                if (chld != -1)
                {
                    Children[chld].AddToContent(item);
                }
            }
        }
        public void AddToContent(List<UDAtom> items)
        {
            if (IsLeaf)
            {
                foreach (UDAtom item in items)
                {
                    Contents.Add(item);
                }
                ShouldSplit();
                updateColor();
            }
            else
            {
                List<UDAtom>[] atoms = new List<UDAtom>[Children.Length];
                for (int i = 0; i < atoms.Length; i++)
                {
                    atoms[i] = new List<UDAtom>();
                }
                for (int i = items.Count - 1; i >= 0; i--)
                {
                    UDAtom item = items[i];
                    int chld = inWhichChild(item.X, item.Y, item.Z);
                    if (chld != -1)
                    {
                        atoms[chld].Add(item);
                    }
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
            if(Contents.Count > MAX_ITEMS)
            {
                split();
            }
        }
        private void split()
        {
            Children = new UDTree[8];
            for(int i = 0; i < 8; i++)
            {
                bool left = i % 2 == 0;
                bool back = (i / 2) % 2 == 0;
                bool bottom = i / 4 == 0;
                Children[i] = new UDTree(
                    left ? X : midWidth,
                    back ? Y : midHeight,
                    bottom ? Z : midLength,
                    left ? midWidth : Width,
                    back ? midHeight : Height,
                    bottom ? midLength : Length,
                    this
                );
            }
            AddToContent(Contents);
            Contents = null;
        }
        public UDTree CheckCollision(UDRaycast ray, out float dist)
        {
            dist = 0;
            Vector3 pos = new Vector3((int)X, (int)Y, (int)Z);
            Vector3 sze = new Vector3((int)Width, (int)Height, (int)Length);
            LineIntersectsCubeResult inThis = UDMath.LineIntersectsCube(
                ray.Position, ray.Position + ray.Direction,
                pos, pos + sze
            );
            Vector3 a = inThis.A, b = inThis.B;
            if (!inThis.Result)
            {
                return null;
            }
            if(IsLeaf)
            {
                if(Contents.Count > 0)
                {
                    a -= ray.Position;
                    b -= ray.Position;
                    float alen = a.Length(), blen = b.Length();
                    if(alen > blen)
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
                int ind = inWhichChild(ray.Position.X, ray.Position.Y, ray.Position.Z, true);
                int[] order = getChildOrder(ind);
                for(int i = 0; i < order.Length; i++)
                {
                    UDTree result = Children[order[i]].CheckCollision(ray, out dist);
                    if(result != null)
                    {
                        return result;
                    }
                }
            }
            return null;
        }
        private int[] getChildOrder(int ind)
        {
            bool left = ind % 2 == 0,
                backward = (ind / 2) % 2 == 0,
                bottom = ind / 4 == 0;
            int[] order = new int[8];
            order[0] = ind;
            for (int i = 0; i < 2; i++)
            {
                int n = (3 * i);
                order[1 + n] = left ? ind + 1 : ind - 1;
                order[2 + n] = backward ? ind + 2 : ind - 2;
                order[3 + n] = bottom ? ind + 4 : ind - 4;
                ind = 7 - ind;
            }
            order[7] = 7 - ind;
            for(int i = 0; i < 8; i++)
            {
                while (order[i] < 0) order[i] += 8;
                order[i] = order[i] % 8;
            }
            return order;
        }
        private int inWhichChild(double x, double y, double z, bool force = false)
        {
            if (!force && (x < X || x > X + Width || y < Y || y > Y + Height || z < Z || z > Z + Length))
            {
                return -1;
            }
            int val = 0;
            if(x >= X + midWidth)
            {
                val += 1;
            }
            if(y >= Y + midHeight)
            {
                val += 2;
            }
            if(z >= Z + midLength)
            {
                val += 4;
            }
            return val;
        }
    }
}
