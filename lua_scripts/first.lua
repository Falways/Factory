local array = {}

for i=1,3 do
	array[i]={}
		 for j=1,3 do
		         array[i][j] = i*j
		 end
end

-- ทรฮสสýื้
for i=1,3 do
   for j=1,3 do
	  print(i.."*"..j,array[i][j])
   end
end
