using Microsoft.Xna.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace UnlimitedDetailEngine2D
{
    public class Camera
    {
        public Color BackgroundColor { get; set; }
        public Vector2 Position { get; set; }
        public float Direction { get; set; }
        public float FieldOfView { get; set; }
        /*public Vector2 ViewVector
        {
            get
            {
                double dir = degreesToRadians(Direction);
                return new Vector2(
                    (float)Math.Cos(dir),
                    (float)Math.Sin(dir)
                );
            }
        }*/
        private Quadtree world { get; set; }
        public Camera(Quadtree world, Vector2 pos, float dir, float fov)
        {
            this.world = world;
            Position = pos;
            Direction = dir;
            FieldOfView = fov;
            BackgroundColor = Color.Black;
        }
        public Color[] DrawView(int width)
        {
            Color[] pixels = new Color[width];
            for(int i = 0; i < pixels.Length; i++)
            {
                double dir = degreesToRadians((Direction - (FieldOfView / 2)) + ((i * FieldOfView) / (double)width));
                Raycast ray = new Raycast(
                    Position,
                    new Vector2(
                        (float)Math.Cos(dir),
                        (float)Math.Sin(dir)
                    )
                );
                float dist;
                Quadtree tree = world.CheckCollision(ray, out dist);
                Color col = BackgroundColor;
                if(tree != null)
                {
                    col = tree.GetColor();
                    col.R = (byte)(col.R * Math.Pow(0.99, dist));
                    col.G = (byte)(col.G * Math.Pow(0.99, dist));
                    col.B = (byte)(col.B * Math.Pow(0.99, dist));
                }
                pixels[i] = col;
            }
            return pixels;
        }
        private static double degreesToRadians(double angle)
        {
            return Math.PI * (angle % 360) / 180d;
        }
        public static Vector2 LengthDir(float len, float dir)
        {
            double d = degreesToRadians(dir);
            return new Vector2(
                (float)Math.Cos(d),
                (float)Math.Sin(d)
            ) * len;
        }
    }
}
