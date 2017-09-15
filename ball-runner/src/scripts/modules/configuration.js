/**
 * 游戏配置文件
 */

export const DPR = window.devicePixelRatio || 1
export const BG_COLOR = '#31102e'  // 背景颜色
export const ROAD_COLOR = '#ff186b' // 道路颜色
export const WALL_COLOR = '#421052' // 墙的颜色
export const GAME_WIDTH = 320 * DPR // 游戏实际宽度
export const GAME_SPEED = 0.5 * DPR // 游戏速度
export const MAX_BALL_PER_DISTANCE = 30 * DPR // 小球的最快移动速度
export const MAX_ROAD_WIDTH = 100 * DPR  // 道路最大宽度
export const MIN_ROAT_WIDTH = 60 * DPR  // 道路最小宽度
export const MAX_LENGTH = 100 * DPR // 一节道路的最大长度
export const MIN_LENGTH = 50 * DPR // 一节道路的最小长度
export const BALL_RADIUS = 6 * DPR // 球的半径
export const TAIL_LENGTH = 100 * DPR // 小球尾巴长度
export const TAIL_DIST = 5 * DPR // 小球与尾巴的距离
export const TAIL_WIDTH = 2 * DPR // 小球尾巴的宽度