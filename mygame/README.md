# 1. Create a new Kaboom project

npx create-kaboom mygame

# 2. Go into the project folder

cd mygame

# 3. Install Kaboom

npm install kaboom

# 4. Install esbuild as dev dependency

npm install --save-dev esbuild

# 5. Or bundle manually with watch mode

npx esbuild src/main.js --bundle --outfile=www/main.js --watch

# 6. Run the development server

npm run dev
