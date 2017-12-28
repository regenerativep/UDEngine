using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace UnlimitedDetailEngine2D
{
    public struct Atom
    {
        public double X { get; set; }
        public double Y { get; set; }
        public byte R { get; set; }
        public byte G { get; set; }
        public byte B { get; set; }
        public Atom(double x, double y, byte r, byte g, byte b)
        {
            X = x;
            Y = y;
            R = r;
            G = g;
            B = b;
        }
        public Atom(double x, double y, int r, int g, int b)
        {
            X = x;
            Y = y;
            R = (byte)r;
            G = (byte)g;
            B = (byte)b;
        }
    }
}
