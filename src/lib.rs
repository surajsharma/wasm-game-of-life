mod utils;

use fixedbitset::FixedBitSet;
use wasm_bindgen::prelude::*;

extern crate fixedbitset;
extern crate js_sys;
extern crate web_sys;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(msg: &str, name: &str) {
    alert(&format!("{}, {}!", msg, name));
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: FixedBitSet,
    intersection: FixedBitSet,
    epoch: bool,
    gen: u32,
}

#[wasm_bindgen]
impl Universe {
    /// Set the width of the universe.
    /// Resets all cells to the dead state.
    pub fn set_width(&mut self, width: u32) {
        self.width = width;
        let size = (width * self.height) as usize;

        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, false);
        }
        self.cells = cells;
    }

    /// Set the height of the universe.
    /// Resets all cells to the dead state.
    pub fn set_height(&mut self, height: u32) {
        self.height = height;
        let size = (self.width * height) as usize;

        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, false);
        }
        self.cells = cells;
    }

    pub fn get_epoch(&self) -> bool {
        self.epoch
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells_ptr(&self) -> *const usize {
        self.cells.as_slice().as_ptr()
    }

    pub fn get_gen(&self) -> u32 {
        self.gen
    }

    pub fn new() -> Universe {
        utils::set_panic_hook();

        let width = 64;
        let height = 32;

        let epoch = false;
        let gen = 0;

        let size = (width * height) as usize;

        let mut cells = FixedBitSet::with_capacity(size);

        for i in 0..size {
            cells.set(i, js_sys::Math::random() < 0.5);
        }

        #[allow(unused)]
        //init intersection of cells with itself
        let mut intersection = FixedBitSet::with_capacity(cells.len());
        intersection = cells.intersection(&cells).collect();

        Universe {
            width,
            height,
            cells,
            intersection,
            epoch,
            gen,
        }
    }

    fn get_index(&self, row: u32, column: u32) -> usize {
        (row * self.width + column) as usize
    }

    fn live_neighbor_count(&self, row: u32, column: u32) -> u8 {
        let mut count = 0;

        for delta_row in [self.height - 1, 0, 1].iter().cloned() {
            for delta_col in [self.width - 1, 0, 1].iter().cloned() {
                if delta_row == 0 && delta_col == 0 {
                    continue;
                }

                let neighbor_row = (row + delta_row) % self.height;
                let neighbor_col = (column + delta_col) % self.width;
                let idx = self.get_index(neighbor_row, neighbor_col);

                count += self.cells[idx] as u8;
            }
        }
        count
    }

    fn compare_intersections(
        set1_intersection: &FixedBitSet,
        set2_intersection: &FixedBitSet,
    ) -> bool {
        let mut are_equal = true;
        if set1_intersection.len() == set2_intersection.len() {
            for i in 0..set1_intersection.len() {
                if set1_intersection.contains(i) != set2_intersection.contains(i) {
                    are_equal = false;
                    break;
                }
            }
        } else {
            are_equal = false;
        }

        are_equal
    }

    pub fn tick(&mut self) {
        if !self.epoch {
            let mut next = self.cells.clone();
            let prev = self.cells.clone();

            for row in 0..self.height {
                for col in 0..self.width {
                    let idx = self.get_index(row, col);
                    let cell = prev[idx];
                    let live_neighbors = self.live_neighbor_count(row, col);
                    next.set(
                        idx,
                        match (cell, live_neighbors) {
                            (true, x) if x < 2 => false,
                            (true, 2) | (true, 3) => true,
                            (true, x) if x > 3 => false,
                            (false, 3) => true,
                            (otherwise, _) => otherwise,
                        },
                    );
                }
            }

            #[allow(unused)]
            let mut next_intersection = FixedBitSet::with_capacity(self.cells.len());
            next_intersection = prev.intersection(&next).collect();

            let intersects = Self::compare_intersections(&self.intersection, &next_intersection);

            if prev == next || intersects {
                self.epoch = true;
            }

            self.cells = next.clone();
            self.gen += 1;
            self.intersection = next_intersection;
        }
    }
}

impl Universe {
    /// Get the dead and alive values of the entire universe.
    pub fn get_cells(&self) -> FixedBitSet {
        self.cells.clone()
    }

    /// Set cells to be alive in a universe by passing the row and column
    /// of each cell as an array.
    pub fn set_cells(&mut self, cells: &[(u32, u32)]) {
        for (row, col) in cells.iter().cloned() {
            let size = (self.width * self.height) as usize;

            let mut cells = FixedBitSet::with_capacity(size);

            let idx = self.get_index(row, col);

            cells.set(idx, true);

            log!("tick {}", cells);

            self.cells = cells;
        }
    }
}
