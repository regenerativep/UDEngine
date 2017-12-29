using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace UnlimitedDetailEngine2D
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game1 : Game
    {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        Camera cam;
        Quadtree quad;
        Texture2D pixels;
        public Game1()
        {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
        }

        /// <summary>
        /// Allows the game to perform any initialization it needs to before starting to run.
        /// This is where it can query for any required services and load any non-graphic
        /// related content.  Calling base.Initialize will enumerate through any components
        /// and initialize them as well.
        /// </summary>
        protected override void Initialize()
        {
            // TODO: Add your initialization logic here
            quad = new Quadtree(0, 0, 512, 512);
            //quad.AddToContent(new Atom(256, 256, 0, 0, 255));
            Random rand = new Random();
            List<Atom> atoms = new List<Atom>();
            for(int i = 0; i < 64; i++)
            {
                int /*x = (int)Math.Sqrt(rand.Next(511 * 511)),
                    y = (int)Math.Sqrt(rand.Next(511 * 511))*/
                    x = rand.Next(512),
                    y = rand.Next(512),
                    r = rand.Next(255),
                    b = rand.Next(255),
                    g = rand.Next(255);
                Debug.WriteLine("[{0},{1}]", x, y);
                atoms.Add(new Atom(x, y, r, g, b));
            }
            quad.AddToContent(atoms);
            cam = new Camera(quad, new Vector2(-32, 256), 0, 180);
            base.Initialize();
        }

        /// <summary>
        /// LoadContent will be called once per game and is the place to load
        /// all of your content.
        /// </summary>
        protected override void LoadContent()
        {
            // Create a new SpriteBatch, which can be used to draw textures.
            spriteBatch = new SpriteBatch(GraphicsDevice);
            pixels = new Texture2D(GraphicsDevice, graphics.GraphicsDevice.Viewport.Width, 1, false, SurfaceFormat.Color);
            // TODO: use this.Content to load your game content here
        }

        /// <summary>
        /// UnloadContent will be called once per game and is the place to unload
        /// game-specific content.
        /// </summary>
        protected override void UnloadContent()
        {
            // TODO: Unload any non ContentManager content here
        }

        /// <summary>
        /// Allows the game to run logic such as updating the world,
        /// checking for collisions, gathering input, and playing audio.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Update(GameTime gameTime)
        {
            //if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
            //    Exit();

            
            pixels.SetData(cam.DrawView(pixels.Width));

            KeyboardState keyState = Keyboard.GetState();

            Vector2 movement = new Vector2(0, 0);
            int spd = 4;
            if (keyState.IsKeyDown(Keys.S))
            {
                movement += Camera.LengthDir(spd, cam.Direction + 180);
            }
            if (keyState.IsKeyDown(Keys.W))
            {
                movement += Camera.LengthDir(spd, cam.Direction);
            }
            if (keyState.IsKeyDown(Keys.A))
            {
                movement += Camera.LengthDir(spd, cam.Direction - 90);
            }
            if (keyState.IsKeyDown(Keys.D))
            {
                movement += Camera.LengthDir(spd, cam.Direction + 90);
            }
            cam.Position += movement;
            if (keyState.IsKeyDown(Keys.Left))
            {
                cam.Direction -= 4;
            }
            if (keyState.IsKeyDown(Keys.Right))
            {
                cam.Direction += 4;
            }

            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);
            
            spriteBatch.Begin();
            spriteBatch.Draw(pixels, new Rectangle(0, 0, graphics.GraphicsDevice.Viewport.Width, 32), Color.White);
            spriteBatch.End();
            base.Draw(gameTime);
        }
    }
}
