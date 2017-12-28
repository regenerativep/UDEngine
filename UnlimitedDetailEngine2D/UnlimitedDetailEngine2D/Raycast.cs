using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xna.Framework;

namespace UnlimitedDetailEngine2D
{
    public class Raycast
    {
        public static float MAX_DISTANCE = 16384;
        public Vector2 Position { get; set; }
        public Vector2 Direction
        {
            get
            {
                return NormalizedDirection * MAX_DISTANCE;
            }
            set
            {
                NormalizedDirection = value;
                NormalizedDirection.Normalize();
            }
        }
        public Vector2 NormalizedDirection { get; private set; }
        public Raycast(Vector2 pos, Vector2 dir)
        {
            Position = pos;
            NormalizedDirection = dir;
        }
    }
}
