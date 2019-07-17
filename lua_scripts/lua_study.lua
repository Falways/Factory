-- 测试 string.find
local start_i = 1
local end_j = 1
local sunstr = ""

local sourcestr= "_abcd,1234,%12+-cs"
print("\nsource string is \""..sourcestr.."\"")

local function print_ret(findsub, i, j, substr)
    print("\nfind substr \""..findsub.."\" ret:")
    print(">start = "..(i or "nil"))
    print(">end = "..(j or "nil"))
    print(">substr = "..(substr or "nil"))
end

-- 查找字符串"a"
start_i, end_j, substr = string.find(sourcestr, "a")
print_ret("a", start_i, end_j, substr)

-- 查找字符串"c"
statrt_i, end_j, substr = string.find(sourcestr, "c")
print_ret("c",start_i, end_j, substr)

-- 匹配查找字符串满足"%d"，表示查找一个数字，参数false可省略
statrt_i, end_j, substr = string.find(sourcestr, "%w,%d",1,false)
print_ret("%w",start_i, end_j, substr)

-- 查找3个连续数字，我们来看看怎样会出现第三个返回值
start_i, end_j, substr = string.find(sourcestr, "(%d%d%d)", 1, false)
print_ret("(%d%d%d)", start_i, end_j, substr)