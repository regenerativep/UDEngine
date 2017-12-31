using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xna.Framework;

namespace UnlimitedDetailEngine
{
    public class UDRaycast
    {
        /// <summary>
        /// max distance rays travel
        /// </summary>
        public static float MAX_DISTANCE = 16384;
        /// <summary>
        /// position of the start of the ray
        /// </summary>
        public Vector3 Position { get; set; }
        /// <summary>
        /// direction of the ray
        /// </summary>
        public Vector3 Direction
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
        /// <summary>
        /// normalized direction of the ray
        /// </summary>
        public Vector3 NormalizedDirection { get; private set; }
        /// <summary>
        /// makes a new unlimited detail raycast
        /// </summary>
        /// <param name="pos">position of start of ray</param>
        /// <param name="dir">direction of ray</param>
        public UDRaycast(Vector3 pos, Vector3 dir)
        {
            Position = pos;
            Direction = dir;
        }
    }
}
