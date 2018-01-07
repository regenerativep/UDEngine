using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Collections.Generic;

namespace UnlimitedDetailEngine
{
    /// <summary>
    /// This is the main type for your game.
    /// </summary>
    public class Game1 : Game
    {
        GraphicsDeviceManager graphics;
        SpriteBatch spriteBatch;
        UDTree tree;
        UDCamera cam;
        KeyboardState lastKeyState;

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
            TargetElapsedTime = TimeSpan.FromTicks(166666);
            GraphicsDevice.PresentationParameters.PresentationInterval = PresentInterval.Two;
            tree = new UDTree(0, 0, 0, 512, 512, 512);
            Random rand = new Random();
            List<UDAtom> atoms = new List<UDAtom>();
            for(int i = 0; i < 5; i++)
            {
                int x = rand.Next(512),
                    y = rand.Next(512),
                    z = rand.Next(512),
                    r = rand.Next(255),
                    b = rand.Next(255),
                    g = rand.Next(255);
                atoms.Add(new UDAtom(x, y, z, r, g, b));
            }
            tree.AddToContent(atoms);
            cam = new UDCamera(this, tree, new Vector3(-64, 256, 256), new Vector2(0, 0), new Vector2(60, 60), Color.White);
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
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
                Exit();

            KeyboardState keyState = Keyboard.GetState();
            if (lastKeyState == null)
                lastKeyState = keyState;

            Vector2 movement = new Vector2(0, 0);
            int spd = 4;
            if (keyState.IsKeyDown(Keys.S))
            {
                movement += UDMath.LengthDir(spd, cam.Direction.X + 180);
            }
            if (keyState.IsKeyDown(Keys.W))
            {
                movement += UDMath.LengthDir(spd, cam.Direction.X);
            }
            if (keyState.IsKeyDown(Keys.A))
            {
                movement += UDMath.LengthDir(spd, cam.Direction.X - 90);
            }
            if (keyState.IsKeyDown(Keys.D))
            {
                movement += UDMath.LengthDir(spd, cam.Direction.X + 90);
            }
            cam.Position.X += movement.X;
            cam.Position.Y += movement.Y;
            if (keyState.IsKeyDown(Keys.Left))
            {
                cam.Direction.X -= 0.5f;
            }
            if (keyState.IsKeyDown(Keys.Right))
            {
                cam.Direction.X += 0.5f;
            }
            if (keyState.IsKeyDown(Keys.Up))
            {
                cam.Direction.Y -= 0.5f;
            }
            if (keyState.IsKeyDown(Keys.Down))
            {
                cam.Direction.Y += 0.5f;
            }

            if (keyState.IsKeyDown(Keys.Space) && !lastKeyState.IsKeyDown(Keys.Space))
            {
                //
            }

            lastKeyState = keyState;
            base.Update(gameTime);
        }

        /// <summary>
        /// This is called when the game should draw itself.
        /// </summary>
        /// <param name="gameTime">Provides a snapshot of timing values.</param>
        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.CornflowerBlue);
            cam.DrawView(this, 64, 64);

            spriteBatch.Begin();
            spriteBatch.Draw(cam.Pixels, new Rectangle(0, 0, GraphicsDevice.Viewport.Width, GraphicsDevice.Viewport.Height), Color.White);
            spriteBatch.End();

            base.Draw(gameTime);
        }
    }
}
