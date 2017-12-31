using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UnlimitedDetailEngine
{
    public struct UDAtom
    {
        /// <summary>
        /// x position
        /// </summary>
        public double X { get; set; }
        /// <summary>
        /// y position
        /// </summary>
        public double Y { get; set; }
        /// <summary>
        /// z position
        /// </summary>
        public double Z { get; set; }
        /// <summary>
        /// red color
        /// </summary>
        public byte R { get; set; }
        /// <summary>
        /// green color
        /// </summary>
        public byte G { get; set; }
        /// <summary>
        /// blue color
        /// </summary>
        public byte B { get; set; }
        /// <summary>
        /// makes a new atom
        /// </summary>
        /// <param name="x">x pos</param>
        /// <param name="y">y pos</param>
        /// <param name="z">z pos</param>
        /// <param name="r">red col</param>
        /// <param name="g">green col</param>
        /// <param name="b">blue col</param>
        public UDAtom(double x, double y, double z, byte r, byte g, byte b)
        {
            X = x;
            Y = y;
            Z = z;
            R = r;
            G = g;
            B = b;
        }
        /// <summary>
        /// makes a new atom
        /// </summary>
        /// <param name="x">x pos</param>
        /// <param name="y">y pos</param>
        /// <param name="z">z pos</param>
        /// <param name="r">red col</param>
        /// <param name="g">green col</param>
        /// <param name="b">blue col</param>
        public UDAtom(double x, double y, double z, int r, int g, int b)
        {
            X = x;
            Y = y;
            Z = z;
            R = (byte)r;
            G = (byte)g;
            B = (byte)b;
        }
    }
}
