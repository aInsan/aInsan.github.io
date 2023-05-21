#include <SDL.h>
#include <iostream>
#include <vector>
#include <cmath>

const int WINDOW_WIDTH = 800;
const int WINDOW_HEIGHT = 600;
const int GRID_SIZE = 30;
const float TIME_STEP = 0.1f;
const float GRAVITY = 9.8f;
const float WIND_FORCE = 2.0f;

struct Particle {
    float x, y;
    float prevX, prevY;
    bool isFixed;
};

std::vector<Particle> particles;
std::vector<int> indices;

void initializeGrid() {
    particles.clear();
    indices.clear();

    for (int i = 0; i < GRID_SIZE; ++i) {
        for (int j = 0; j < GRID_SIZE; ++j) {
            float x = WINDOW_WIDTH / 2 + i * 20.0f - GRID_SIZE * 10.0f;
            float y = 100 + j * 20.0f;
            particles.push_back({ x, y, x, y, j == 0 });
            indices.push_back(i * GRID_SIZE + j);
        }
    }
}

void handleEvents(bool& isRunning) {
    SDL_Event event;
    while (SDL_PollEvent(&event)) {
        if (event.type == SDL_QUIT) {
            isRunning = false;
        }
        else if (event.type == SDL_MOUSEBUTTONDOWN && event.button.button == SDL_BUTTON_LEFT) {
            int mouseX = event.button.x;
            int mouseY = event.button.y;

            for (auto& particle : particles) {
                float dx = particle.x - mouseX;
                float dy = particle.y - mouseY;
                float distSquared = dx * dx + dy * dy;
                if (distSquared < 200.0f && !particle.isFixed) {
                    particle.x = mouseX;
                    particle.y = mouseY;
                    particle.prevX = mouseX;
                    particle.prevY = mouseY;
                }
            }
        }
        else if (event.type == SDL_MOUSEMOTION && (event.motion.state & SDL_BUTTON(SDL_BUTTON_RIGHT))) {
            int mouseX = event.motion.xrel;
            int mouseY = event.motion.yrel;

            for (auto& particle : particles) {
                float dx = particle.x - event.motion.x;
                float dy = particle.y - event.motion.y;
                float distSquared = dx * dx + dy * dy;
                if (distSquared < 200.0f && !particle.isFixed) {
                    particle.x += mouseX;
                    particle.y += mouseY;
                    particle.prevX += mouseX;
                    particle.prevY += mouseY;
                }
            }
        }
    }
}

void updateParticles() {
    for (auto& particle : particles) {
        if (particle.isFixed) {
            continue;
        }

        float tempX = particle.x;
        float tempY = particle.y;
        particle.x += (particle.x - particle.prevX);
        particle.y += (particle.y - particle.prevY);
        particle.x += 0.02f * WIND_FORCE;
        particle.y += 0.02f * GRAVITY;

        particle.prevX = tempX;
        particle.prevY = tempY;
    }

    for (int step = 0; step < 10; ++step) {
        for (auto& index : indices) {
            Particle& p1 = particles[index];

            if (index + 1 < particles.size()) {
                Particle& p2 = particles[index + 1];
                float dx = p2.x - p1.x;
                float dy = p2.y - p1.y;
                float distance = std::sqrt(dx * dx + dy * dy);
                float difference = (distance - 20.0f) / distance;

                p1.x += dx * 0.5f * difference;
                p1.y += dy * 0.5f * difference;
                p2.x -= dx * 0.5f * difference;
                p2.y -= dy * 0.5f * difference;
            }

            if (index + GRID_SIZE < particles.size()) {
                Particle& p2 = particles[index + GRID_SIZE];
                float dx = p2.x - p1.x;
                float dy = p2.y - p1.y;
                float distance = std::sqrt(dx * dx + dy * dy);
                float difference = (distance - 20.0f) / distance;

                p1.x += dx * 0.5f * difference;
                p1.y += dy * 0.5f * difference;
                p2.x -= dx * 0.5f * difference;
                p2.y -= dy * 0.5f * difference;
            }
        }
    }
}

void renderParticles(SDL_Renderer* renderer) {
    SDL_SetRenderDrawColor(renderer, 255, 255, 255, 255);
    for (const auto& particle : particles) {
        SDL_RenderDrawPoint(renderer, static_cast<int>(particle.x), static_cast<int>(particle.y));
    }
}

int main() {
    if (SDL_Init(SDL_INIT_VIDEO) != 0) {
        std::cerr << "Failed to initialize SDL: " << SDL_GetError() << std::endl;
        return 1;
    }

    SDL_Window* window = SDL_CreateWindow("Cloth Simulation", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, WINDOW_WIDTH, WINDOW_HEIGHT, SDL_WINDOW_SHOWN);
    if (window == nullptr) {
        std::cerr << "Failed to create SDL window: " << SDL_GetError() << std::endl;
        SDL_Quit();
        return 1;
    }

    SDL_Renderer* renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (renderer == nullptr) {
        std::cerr << "Failed to create SDL renderer: " << SDL_GetError() << std::endl;
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    initializeGrid();

    bool isRunning = true;
    while (isRunning) {
        handleEvents(isRunning);

        updateParticles();

        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        SDL_RenderClear(renderer);

        renderParticles(renderer);

        SDL_RenderPresent(renderer);
        SDL_Delay(static_cast<Uint32>(TIME_STEP * 1000));
    }

    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();

    return 0;
}
