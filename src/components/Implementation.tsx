
import React, { useState } from 'react';
import CodeBlock from './CodeBlock';

const codeExamples = {
  semaphore: {
    python: `# Semaphore-based solution for the Dining Philosophers problem
import threading
import time
import random

# Number of philosophers
N = 5

# Shared resources - the forks
forks = [threading.Semaphore(1) for _ in range(N)]

# For printing synchronized output
printing = threading.Semaphore(1)

def philosopher(index):
    """Represent a philosopher's lifecycle"""
    while True:
        # Thinking
        thinking_time = random.uniform(1, 3)
        with printing:
            print(f"Philosopher {index} is thinking for {thinking_time:.2f} seconds")
        time.sleep(thinking_time)
        
        with printing:
            print(f"Philosopher {index} is hungry and trying to acquire forks")
        
        # Try to pickup left fork first
        left_fork = index
        right_fork = (index + 1) % N
        
        # Acquire left fork
        forks[left_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up left fork {left_fork}")
        
        # Introduce a small delay to make deadlock more likely
        time.sleep(0.1)
        
        # Acquire right fork
        forks[right_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up right fork {right_fork}")
        
        # Eating
        eating_time = random.uniform(1, 2)
        with printing:
            print(f"Philosopher {index} is eating for {eating_time:.2f} seconds")
        time.sleep(eating_time)
        
        # Put down right fork
        forks[right_fork].release()
        with printing:
            print(f"Philosopher {index} put down right fork {right_fork}")
        
        # Put down left fork
        forks[left_fork].release()
        with printing:
            print(f"Philosopher {index} put down left fork {left_fork}")

# Create and start all philosopher threads
philosophers = []
for i in range(N):
    t = threading.Thread(target=philosopher, args=(i,))
    t.daemon = True  # Daemon threads exit when the main program exits
    philosophers.append(t)
    t.start()

# Let the simulation run for a while
try:
    time.sleep(30)  # Run for 30 seconds
except KeyboardInterrupt:
    print("Simulation interrupted")

print("Simulation complete")

# Note: This implementation can deadlock! All philosophers might pick up 
# their left fork and wait forever for their right fork.`,

    c: `/* Semaphore-based solution for the Dining Philosophers problem */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5                  /* Number of philosophers */
#define LEFT (i)             /* Left fork for philosopher i */
#define RIGHT ((i+1)%N)      /* Right fork for philosopher i */
#define THINKING 0           /* Philosopher is thinking */
#define HUNGRY 1             /* Philosopher is hungry */
#define EATING 2             /* Philosopher is eating */

sem_t forks[N];              /* Semaphores for forks */
sem_t mutex;                 /* Mutex for critical sections */
int state[N];                /* State of each philosopher */

void *philosopher(void *arg);
void think(int i);
void pickup_forks(int i);
void eat(int i);
void putdown_forks(int i);

int main() {
    int i;
    pthread_t thread_id[N];
    
    /* Initialize semaphores */
    sem_init(&mutex, 0, 1);
    for (i = 0; i < N; i++) {
        sem_init(&forks[i], 0, 1);
    }
    
    /* Initialize states */
    for (i = 0; i < N; i++) {
        state[i] = THINKING;
    }
    
    /* Create philosopher threads */
    for (i = 0; i < N; i++) {
        pthread_create(&thread_id[i], NULL, philosopher, (void *)(long)i);
        printf("Philosopher %d is thinking\n", i);
    }
    
    /* Join threads (never reached in this example) */
    for (i = 0; i < N; i++) {
        pthread_join(thread_id[i], NULL);
    }
    
    return 0;
}

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    
    while (1) {
        think(i);            /* Philosopher thinks */
        pickup_forks(i);     /* Acquire two forks or block */
        eat(i);              /* Philosopher eats */
        putdown_forks(i);    /* Put down both forks */
    }
}

void think(int i) {
    printf("Philosopher %d is thinking\n", i);
    sleep(rand() % 3 + 1);  /* Think for 1-3 seconds */
}

void pickup_forks(int i) {
    printf("Philosopher %d is hungry\n", i);
    
    sem_wait(&mutex);        /* Enter critical section */
    state[i] = HUNGRY;       /* Record that I'm hungry */
    
    /* Try to acquire left fork */
    sem_wait(&forks[LEFT(i)]);
    printf("Philosopher %d picked up left fork %d\n", i, LEFT(i));
    
    /* Introduce a delay to make deadlock more likely */
    usleep(100000);  /* 100ms */
    
    /* Try to acquire right fork */
    sem_wait(&forks[RIGHT(i)]);
    printf("Philosopher %d picked up right fork %d\n", i, RIGHT(i));
    
    sem_post(&mutex);        /* Exit critical section */
}

void eat(int i) {
    state[i] = EATING;
    printf("Philosopher %d is eating\n", i);
    sleep(rand() % 2 + 1);  /* Eat for 1-2 seconds */
}

void putdown_forks(int i) {
    state[i] = THINKING;
    
    /* Release right fork */
    sem_post(&forks[RIGHT(i)]);
    printf("Philosopher %d put down right fork %d\n", i, RIGHT(i));
    
    /* Release left fork */
    sem_post(&forks[LEFT(i)]);
    printf("Philosopher %d put down left fork %d\n", i, LEFT(i));
}

/* Note: This implementation can deadlock! All philosophers might pick up 
   their left fork and wait forever for their right fork. */`
  },
  mutex: {
    python: `# Resource Hierarchy solution for the Dining Philosophers problem
import threading
import time
import random

# Number of philosophers
N = 5

# Shared resources - the forks (now as locks/mutexes)
forks = [threading.Lock() for _ in range(N)]

# For printing synchronized output
printing = threading.Lock()

def philosopher(index):
    """Represent a philosopher's lifecycle"""
    while True:
        # Thinking
        thinking_time = random.uniform(1, 3)
        with printing:
            print(f"Philosopher {index} is thinking for {thinking_time:.2f} seconds")
        time.sleep(thinking_time)
        
        with printing:
            print(f"Philosopher {index} is hungry and trying to acquire forks")
        
        # Resource Hierarchy Solution
        # Always pick up the lower-numbered fork first
        # This prevents the circular wait condition
        first_fork = min(index, (index + 1) % N)
        second_fork = max(index, (index + 1) % N)
        
        # Acquire first fork
        forks[first_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up fork {first_fork}")
        
        # Acquire second fork
        forks[second_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up fork {second_fork}")
        
        # Eating
        eating_time = random.uniform(1, 2)
        with printing:
            print(f"Philosopher {index} is eating for {eating_time:.2f} seconds")
        time.sleep(eating_time)
        
        # Put down second fork
        forks[second_fork].release()
        with printing:
            print(f"Philosopher {index} put down fork {second_fork}")
        
        # Put down first fork
        forks[first_fork].release()
        with printing:
            print(f"Philosopher {index} put down fork {first_fork}")

# Create and start all philosopher threads
philosophers = []
for i in range(N):
    t = threading.Thread(target=philosopher, args=(i,))
    t.daemon = True  # Daemon threads exit when the main program exits
    philosophers.append(t)
    t.start()

# Let the simulation run for a while
try:
    time.sleep(30)  # Run for 30 seconds
except KeyboardInterrupt:
    print("Simulation interrupted")

print("Simulation complete")

# Note: This solution prevents deadlock by breaking the circular wait
# condition. However, it may lead to starvation in some cases where
# certain philosophers consistently get priority over others.`,

    c: `/* Resource Hierarchy solution for the Dining Philosophers problem */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define N 5                  /* Number of philosophers */
#define THINKING 0           /* Philosopher is thinking */
#define HUNGRY 1             /* Philosopher is hungry */
#define EATING 2             /* Philosopher is eating */

pthread_mutex_t forks[N];    /* Mutex locks for forks */
pthread_mutex_t printing;    /* Mutex for synchronized printing */
int state[N];                /* State of each philosopher */

void *philosopher(void *arg);
void think(int i);
void pickup_forks(int i);
void eat(int i);
void putdown_forks(int i);

int main() {
    int i;
    pthread_t thread_id[N];
    
    /* Initialize mutexes */
    pthread_mutex_init(&printing, NULL);
    for (i = 0; i < N; i++) {
        pthread_mutex_init(&forks[i], NULL);
    }
    
    /* Initialize states */
    for (i = 0; i < N; i++) {
        state[i] = THINKING;
    }
    
    /* Create philosopher threads */
    for (i = 0; i < N; i++) {
        pthread_create(&thread_id[i], NULL, philosopher, (void *)(long)i);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d is thinking\n", i);
        pthread_mutex_unlock(&printing);
    }
    
    /* Join threads (never reached in this example) */
    for (i = 0; i < N; i++) {
        pthread_join(thread_id[i], NULL);
    }
    
    return 0;
}

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    
    while (1) {
        think(i);            /* Philosopher thinks */
        pickup_forks(i);     /* Acquire two forks or block */
        eat(i);              /* Philosopher eats */
        putdown_forks(i);    /* Put down both forks */
    }
}

void think(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is thinking\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 3 + 1);  /* Think for 1-3 seconds */
}

void pickup_forks(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is hungry\n", i);
    pthread_mutex_unlock(&printing);
    
    state[i] = HUNGRY;
    
    /* Resource Hierarchy Solution */
    /* Always pick up the lower-numbered fork first */
    int first_fork = i < (i + 1) % N ? i : (i + 1) % N;
    int second_fork = i < (i + 1) % N ? (i + 1) % N : i;
    
    /* Acquire first fork */
    pthread_mutex_lock(&forks[first_fork]);
    pthread_mutex_lock(&printing);
    printf("Philosopher %d picked up fork %d\n", i, first_fork);
    pthread_mutex_unlock(&printing);
    
    /* Acquire second fork */
    pthread_mutex_lock(&forks[second_fork]);
    pthread_mutex_lock(&printing);
    printf("Philosopher %d picked up fork %d\n", i, second_fork);
    pthread_mutex_unlock(&printing);
}

void eat(int i) {
    state[i] = EATING;
    
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is eating\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 2 + 1);  /* Eat for 1-2 seconds */
}

void putdown_forks(int i) {
    state[i] = THINKING;
    
    /* Resource Hierarchy Solution */
    /* Release in reverse order of acquisition */
    int first_fork = i < (i + 1) % N ? i : (i + 1) % N;
    int second_fork = i < (i + 1) % N ? (i + 1) % N : i;
    
    /* Release second fork */
    pthread_mutex_unlock(&forks[second_fork]);
    pthread_mutex_lock(&printing);
    printf("Philosopher %d put down fork %d\n", i, second_fork);
    pthread_mutex_unlock(&printing);
    
    /* Release first fork */
    pthread_mutex_unlock(&forks[first_fork]);
    pthread_mutex_lock(&printing);
    printf("Philosopher %d put down fork %d\n", i, first_fork);
    pthread_mutex_unlock(&printing);
}

/* Note: This solution prevents deadlock by breaking the circular wait condition.
   However, it may lead to starvation in some cases where certain philosophers
   consistently get priority over others. */`
  },
  monitor: {
    python: `# Monitor-based solution for the Dining Philosophers problem
import threading
import time
import random
from enum import Enum

# Number of philosophers
N = 5

class State(Enum):
    THINKING = 0
    HUNGRY = 1
    EATING = 2

# Current state of each philosopher
state = [State.THINKING] * N

# Condition variables for each philosopher
condition = [threading.Condition() for _ in range(N)]

# Mutex to protect the state variables
mutex = threading.Lock()

# For printing synchronized output
printing = threading.Lock()

def test(i):
    """
    Test if philosopher i can eat (i.e., both forks are available)
    and if so, change state to EATING and notify the philosopher
    """
    if (state[i] == State.HUNGRY and 
        state[(i - 1) % N] != State.EATING and 
        state[(i + 1) % N] != State.EATING):
        # Both neighbors are not eating, so this philosopher can eat
        state[i] = State.EATING
        with condition[i]:
            condition[i].notify()  # Wake up the hungry philosopher

def philosopher(index):
    """Represent a philosopher's lifecycle"""
    while True:
        # Thinking
        thinking_time = random.uniform(1, 3)
        with printing:
            print(f"Philosopher {index} is thinking for {thinking_time:.2f} seconds")
        time.sleep(thinking_time)
        
        # Get hungry
        with printing:
            print(f"Philosopher {index} is hungry")
        
        # Try to acquire both forks (enter critical section)
        with mutex:
            state[index] = State.HUNGRY
            # Try to eat
            test(index)
            # If can't eat now, wait until notified
            with condition[index]:
                while state[index] != State.EATING:
                    condition[index].wait()
        
        # Eating (outside critical section)
        eating_time = random.uniform(1, 2)
        with printing:
            print(f"Philosopher {index} is eating for {eating_time:.2f} seconds")
        time.sleep(eating_time)
        
        # Done eating, put down forks
        with printing:
            print(f"Philosopher {index} is putting down forks")
        
        # Enter critical section
        with mutex:
            state[index] = State.THINKING
            # See if left or right neighbor can eat now
            test((index + 1) % N)  # Right neighbor
            test((index - 1) % N)  # Left neighbor

# Create and start all philosopher threads
philosophers = []
for i in range(N):
    t = threading.Thread(target=philosopher, args=(i,))
    t.daemon = True  # Daemon threads exit when the main program exits
    philosophers.append(t)
    t.start()

# Let the simulation run for a while
try:
    time.sleep(30)  # Run for 30 seconds
except KeyboardInterrupt:
    print("Simulation interrupted")

print("Simulation complete")

# Note: This monitor-based solution guarantees deadlock-freedom
# and can also prevent starvation with proper implementation
# of the condition variables.`,

    c: `/* Monitor-based solution for the Dining Philosophers problem */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>

#define N 5                  /* Number of philosophers */
#define LEFT (i)             /* Left neighbor of philosopher i */
#define RIGHT ((i+1)%N)      /* Right neighbor of philosopher i */
#define THINKING 0           /* Philosopher is thinking */
#define HUNGRY 1             /* Philosopher is hungry */
#define EATING 2             /* Philosopher is eating */

typedef struct {
    pthread_mutex_t mutex;   /* Mutex for the monitor */
    pthread_cond_t cond[N];  /* Condition variable for each philosopher */
    int state[N];            /* State of each philosopher */
} monitor_t;

monitor_t dp_monitor;        /* The dining philosophers monitor */
pthread_mutex_t printing;    /* Mutex for synchronized printing */

void *philosopher(void *arg);
void think(int i);
void take_forks(int i);
void put_forks(int i);
void eat(int i);
void test(int i);
void init_monitor();

int main() {
    int i;
    pthread_t thread_id[N];
    
    /* Initialize mutexes and monitor */
    pthread_mutex_init(&printing, NULL);
    init_monitor();
    
    /* Create philosopher threads */
    for (i = 0; i < N; i++) {
        pthread_create(&thread_id[i], NULL, philosopher, (void *)(long)i);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d is thinking\n", i);
        pthread_mutex_unlock(&printing);
    }
    
    /* Join threads (never reached in this example) */
    for (i = 0; i < N; i++) {
        pthread_join(thread_id[i], NULL);
    }
    
    return 0;
}

void init_monitor() {
    int i;
    
    /* Initialize monitor mutex */
    pthread_mutex_init(&dp_monitor.mutex, NULL);
    
    /* Initialize state and condition variables */
    for (i = 0; i < N; i++) {
        dp_monitor.state[i] = THINKING;
        pthread_cond_init(&dp_monitor.cond[i], NULL);
    }
}

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    
    while (1) {
        think(i);            /* Philosopher thinks */
        take_forks(i);       /* Acquire two forks or block */
        eat(i);              /* Philosopher eats */
        put_forks(i);        /* Put down both forks */
    }
}

void think(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is thinking\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 3 + 1);  /* Think for 1-3 seconds */
}

void take_forks(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is hungry\n", i);
    pthread_mutex_unlock(&printing);
    
    pthread_mutex_lock(&dp_monitor.mutex);  /* Enter critical section */
    
    dp_monitor.state[i] = HUNGRY;  /* Record I'm hungry */
    test(i);                       /* Try to acquire two forks */
    
    /* If didn't get both forks, wait */
    while (dp_monitor.state[i] != EATING) {
        pthread_cond_wait(&dp_monitor.cond[i], &dp_monitor.mutex);
    }
    
    pthread_mutex_unlock(&dp_monitor.mutex);  /* Exit critical section */
}

void put_forks(int i) {
    pthread_mutex_lock(&dp_monitor.mutex);  /* Enter critical section */
    
    dp_monitor.state[i] = THINKING;  /* Back to thinking */
    
    pthread_mutex_lock(&printing);
    printf("Philosopher %d putting down forks\n", i);
    pthread_mutex_unlock(&printing);
    
    /* See if neighbors can now eat */
    test(LEFT(i));  /* See if left neighbor can now eat */
    test(RIGHT(i)); /* See if right neighbor can now eat */
    
    pthread_mutex_unlock(&dp_monitor.mutex);  /* Exit critical section */
}

void eat(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is eating\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 2 + 1);  /* Eat for 1-2 seconds */
}

void test(int i) {
    /* If I'm hungry and my neighbors are not eating, let me eat */
    if (dp_monitor.state[i] == HUNGRY && 
        dp_monitor.state[LEFT(i)] != EATING && 
        dp_monitor.state[RIGHT(i)] != EATING) {
        
        dp_monitor.state[i] = EATING;
        
        pthread_mutex_lock(&printing);
        printf("Philosopher %d has taken forks %d and %d\n", i, LEFT(i), i);
        pthread_mutex_unlock(&printing);
        
        pthread_cond_signal(&dp_monitor.cond[i]);  /* Wake up this philosopher */
    }
}

/* Note: This monitor-based solution guarantees deadlock-freedom and can
   also prevent starvation with proper implementation of the condition
   variables. Each philosopher only eats when both neighbors are not eating. */`
  },
  waiter: {
    python: `# Arbitrator (Waiter) solution for the Dining Philosophers problem
import threading
import time
import random

# Number of philosophers
N = 5

# The waiter (central arbitrator) - controls who can pick up forks
waiter = threading.Semaphore(N-1)  # Allow at most N-1 philosophers to try to eat

# Shared resources - the forks
forks = [threading.Lock() for _ in range(N)]

# For printing synchronized output
printing = threading.Lock()

def philosopher(index):
    """Represent a philosopher's lifecycle"""
    while True:
        # Thinking
        thinking_time = random.uniform(1, 3)
        with printing:
            print(f"Philosopher {index} is thinking for {thinking_time:.2f} seconds")
        time.sleep(thinking_time)
        
        # Get permission from the waiter before attempting to eat
        waiter.acquire()
        
        with printing:
            print(f"Philosopher {index} has permission from the waiter")
        
        # Pick up left fork
        left_fork = index
        forks[left_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up left fork {left_fork}")
        
        # Pick up right fork
        right_fork = (index + 1) % N
        forks[right_fork].acquire()
        with printing:
            print(f"Philosopher {index} picked up right fork {right_fork}")
        
        # Eating
        eating_time = random.uniform(1, 2)
        with printing:
            print(f"Philosopher {index} is eating for {eating_time:.2f} seconds")
        time.sleep(eating_time)
        
        # Put down right fork
        forks[right_fork].release()
        with printing:
            print(f"Philosopher {index} put down right fork {right_fork}")
        
        # Put down left fork
        forks[left_fork].release()
        with printing:
            print(f"Philosopher {index} put down left fork {left_fork}")
        
        # Tell the waiter we're done
        waiter.release()
        with printing:
            print(f"Philosopher {index} notified the waiter they're done")

# Create and start all philosopher threads
philosophers = []
for i in range(N):
    t = threading.Thread(target=philosopher, args=(i,))
    t.daemon = True  # Daemon threads exit when the main program exits
    philosophers.append(t)
    t.start()

# Let the simulation run for a while
try:
    time.sleep(30)  # Run for 30 seconds
except KeyboardInterrupt:
    print("Simulation interrupted")

print("Simulation complete")

# Note: This solution ensures that at most N-1 philosophers can attempt
# to eat simultaneously, which prevents the circular wait condition.
# It's a simple and effective solution but introduces a central bottleneck.`,

    c: `/* Arbitrator (Waiter) solution for the Dining Philosophers problem */
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define N 5                  /* Number of philosophers */
#define LEFT (i)             /* Left fork for philosopher i */
#define RIGHT ((i+1)%N)      /* Right fork for philosopher i */

pthread_mutex_t forks[N];    /* Mutex locks for forks */
sem_t waiter;                /* Semaphore for the waiter */
pthread_mutex_t printing;    /* Mutex for synchronized printing */

void *philosopher(void *arg);
void think(int i);
void eat(int i);

int main() {
    int i;
    pthread_t thread_id[N];
    
    /* Initialize mutexes and semaphore */
    pthread_mutex_init(&printing, NULL);
    for (i = 0; i < N; i++) {
        pthread_mutex_init(&forks[i], NULL);
    }
    
    /* Initialize waiter semaphore to N-1 (allow at most N-1 philosophers to try to eat) */
    sem_init(&waiter, 0, N-1);
    
    /* Create philosopher threads */
    for (i = 0; i < N; i++) {
        pthread_create(&thread_id[i], NULL, philosopher, (void *)(long)i);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d is thinking\n", i);
        pthread_mutex_unlock(&printing);
    }
    
    /* Join threads (never reached in this example) */
    for (i = 0; i < N; i++) {
        pthread_join(thread_id[i], NULL);
    }
    
    return 0;
}

void *philosopher(void *arg) {
    int i = (int)(long)arg;
    
    while (1) {
        think(i);            /* Philosopher thinks */
        
        /* Get permission from the waiter before attempting to eat */
        sem_wait(&waiter);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d has permission from the waiter\n", i);
        pthread_mutex_unlock(&printing);
        
        /* Pick up left fork */
        pthread_mutex_lock(&forks[LEFT(i)]);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d picked up left fork %d\n", i, LEFT(i));
        pthread_mutex_unlock(&printing);
        
        /* Pick up right fork */
        pthread_mutex_lock(&forks[RIGHT(i)]);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d picked up right fork %d\n", i, RIGHT(i));
        pthread_mutex_unlock(&printing);
        
        eat(i);              /* Philosopher eats */
        
        /* Put down right fork */
        pthread_mutex_unlock(&forks[RIGHT(i)]);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d put down right fork %d\n", i, RIGHT(i));
        pthread_mutex_unlock(&printing);
        
        /* Put down left fork */
        pthread_mutex_unlock(&forks[LEFT(i)]);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d put down left fork %d\n", i, LEFT(i));
        pthread_mutex_unlock(&printing);
        
        /* Tell the waiter we're done */
        sem_post(&waiter);
        pthread_mutex_lock(&printing);
        printf("Philosopher %d notified the waiter they're done\n", i);
        pthread_mutex_unlock(&printing);
    }
}

void think(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is thinking\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 3 + 1);  /* Think for 1-3 seconds */
}

void eat(int i) {
    pthread_mutex_lock(&printing);
    printf("Philosopher %d is eating\n", i);
    pthread_mutex_unlock(&printing);
    
    sleep(rand() % 2 + 1);  /* Eat for 1-2 seconds */
}

/* Note: This solution ensures that at most N-1 philosophers can attempt
   to eat simultaneously, which prevents the circular wait condition.
   It's a simple and effective solution but introduces a central bottleneck. */`
  }
};

const Implementation: React.FC = () => {
  const [activeLanguage, setActiveLanguage] = useState<'python' | 'c'>('python');
  const [activeSolution, setActiveSolution] = useState('semaphore');
  
  return (
    <section id="implementation" className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <h4 className="section-title">Code Examples</h4>
          <h2 className="title-medium mb-6 pb-2 subtle-underline inline-block">Implementation Approaches</h2>
          <p className="text-lg text-apple-gray max-w-3xl mx-auto">
            Explore practical code implementations of the different solutions to the Dining Philosophers problem.
          </p>
        </div>
        
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button
            className={`px-4 py-2 rounded-md ${
              activeSolution === 'semaphore' 
                ? 'bg-apple-blue text-white' 
                : 'bg-gray-100 text-apple-darkgray hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveSolution('semaphore')}
          >
            Semaphore Solution
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeSolution === 'mutex' 
                ? 'bg-apple-blue text-white' 
                : 'bg-gray-100 text-apple-darkgray hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveSolution('mutex')}
          >
            Resource Hierarchy
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeSolution === 'monitor' 
                ? 'bg-apple-blue text-white' 
                : 'bg-gray-100 text-apple-darkgray hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveSolution('monitor')}
          >
            Monitor Solution
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeSolution === 'waiter' 
                ? 'bg-apple-blue text-white' 
                : 'bg-gray-100 text-apple-darkgray hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveSolution('waiter')}
          >
            Arbitrator Solution
          </button>
        </div>
        
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                activeLanguage === 'python'
                  ? 'bg-apple-blue text-white'
                  : 'bg-white text-apple-darkgray border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setActiveLanguage('python')}
            >
              Python
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                activeLanguage === 'c'
                  ? 'bg-apple-blue text-white'
                  : 'bg-white text-apple-darkgray border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setActiveLanguage('c')}
            >
              C
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <CodeBlock 
            code={codeExamples[activeSolution][activeLanguage]} 
            language={activeLanguage}
            title={`${activeSolution.charAt(0).toUpperCase() + activeSolution.slice(1)} Solution in ${activeLanguage.charAt(0).toUpperCase() + activeLanguage.slice(1)}`}
          />
        </div>
        
        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 text-apple-black">Code Walkthrough</h3>
          <p className="mb-4 text-apple-darkgray">
            The implemented solutions demonstrate different approaches to solving the Dining Philosophers problem:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-apple-black">Semaphore-based Solution:</p>
                <p className="text-apple-darkgray">The most straightforward approach using semaphores or mutexes to represent forks. Each philosopher tries to pick up their left fork first, then their right fork. This solution is prone to deadlock.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-apple-black">Resource Hierarchy Solution:</p>
                <p className="text-apple-darkgray">Establishes a global ordering of resources (forks) and ensures philosophers always pick up the lowest-numbered fork first. This breaks the circular wait condition and prevents deadlock.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-apple-black">Monitor Solution:</p>
                <p className="text-apple-darkgray">Uses a monitor with condition variables to control access to forks. A philosopher can only eat when both neighbors are not eating. This solution prevents deadlock and can be designed to prevent starvation.</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 rounded-full bg-apple-blue flex items-center justify-center text-white mt-0.5 mr-3 flex-shrink-0">4</div>
              <div>
                <p className="font-semibold text-apple-black">Arbitrator (Waiter) Solution:</p>
                <p className="text-apple-darkgray">Introduces a central controller (waiter) that allows at most N-1 philosophers to attempt to eat simultaneously. This prevents the circular wait condition and thus deadlock, but introduces a potential bottleneck.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Implementation;
