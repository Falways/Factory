-- ���� string.find
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

-- �����ַ���"a"
start_i, end_j, substr = string.find(sourcestr, "a")
print_ret("a", start_i, end_j, substr)

-- �����ַ���"c"
statrt_i, end_j, substr = string.find(sourcestr, "c")
print_ret("c",start_i, end_j, substr)

-- ƥ������ַ�������"%d"����ʾ����һ�����֣�����false��ʡ��
statrt_i, end_j, substr = string.find(sourcestr, "%w,%d",1,false)
print_ret("%w",start_i, end_j, substr)

-- ����3���������֣�������������������ֵ���������ֵ
start_i, end_j, substr = string.find(sourcestr, "(%d%d%d)", 1, false)
print_ret("(%d%d%d)", start_i, end_j, substr)