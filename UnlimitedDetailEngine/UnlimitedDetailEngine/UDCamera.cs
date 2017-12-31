using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;

namespace UnlimitedDetailEngine
{
    public class UDCamera
    {
        /// <summary>
        /// color to put when there is no color to put
        /// </summary>
        public Color BackgroundColor { get; set; }
        /// <summary>
        /// position of camera
        /// </summary>
        public Vector3 Position;
        /// <summary>
        /// direction (degrees) of camera; x -> yaw, y -> pitch
        /// </summary>
        public Vector2 Direction;
        /// <summary>
        /// field of view (degrees) of the camera; x -> horizontal fov, y -> vertical fov
        /// </summary>
        public Vector2 FieldOfView { get; set; }
        /// <summary>
        /// the world to draw
        /// </summary>
        public UDTree World { get; set; }
        /// <summary>
        /// the pixels drawn
        /// </summary>
        public Texture2D Pixels { get; private set; }
        /// <summary>
        /// a reference to the game
        /// </summary>
        private Game game { get; set; }
        /// <summary>
        /// makes new unlimited detail camera
        /// </summary>
        /// <param name="world">world to draw</param>
        /// <param name="pos">position to draw from</param>
        /// <param name="dir">direction (degrees) to look at</param>
        /// <param name="fov">field of view (degrees)</param>
        /// <param name="bgcol">background color</param>
        public UDCamera(Game game, UDTree world, Vector3 pos, Vector2 dir, Vector2 fov, Color bgcol)
        {
            World = world;
            Position = pos;
            Direction = dir;
            FieldOfView = fov;
            BackgroundColor = bgcol;
            Pixels = new Texture2D(game.GraphicsDevice, game.GraphicsDevice.Viewport.Width, game.GraphicsDevice.Viewport.Height, false, SurfaceFormat.Color);
            Color[,] pixels = new Color[game.GraphicsDevice.Viewport.Width, game.GraphicsDevice.Viewport.Height];
            for(int i = 0; i < pixels.GetLength(0); i++)
            {
                for (int j = 0; j < pixels.GetLength(1); j++)
                {
                    pixels[i, j] = BackgroundColor;
                }
            }
        }
        public void DrawView(int width, int height)
        {
            Color[] pixels = new Color[width * height];
            for(int i = 0; i < width; i++)
            {
                double yawD = (Direction.X - (FieldOfView.X / 2)) + ((i * FieldOfView.X) / (double)width);
                double yaw = UDMath.DegreesToRadians(yawD);

                for (int j = 0; j < height; j++)
                {
                    double pitD = (Direction.Y - (FieldOfView.Y / 2)) + ((j * FieldOfView.Y) / (double)height);
                    double pit = UDMath.DegreesToRadians(pitD);
                    Vector3 vec = UDMath.LengthDir(1, (float)yawD, (float)pitD);
                    UDRaycast ray = new UDRaycast(Position, vec);
                    float dist;
                    UDTree tree = World.CheckCollision(ray, out dist);
                    Color col = BackgroundColor;
                    if(tree != null)
                    {
                        col = tree.GetColor();
                    }
                    pixels[(j * width) + i] = col;
                }
            }
            if(Pixels.Width != width || Pixels.Height != height)
            {
                Pixels = new Texture2D(game.GraphicsDevice, width, height);
            }
            Pixels.SetData(pixels);
        }
    }
}
