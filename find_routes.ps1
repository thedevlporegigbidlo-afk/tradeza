$regex = [regex]'href="([^"]+)"'
$c = [System.IO.File]::ReadAllText('code.html')
$seen = @{}
foreach ($m in $regex.Matches($c)) {
  $l = $m.Groups[1].Value
  if ($l.StartsWith('/')) {
    $p = ($l -split '[?#]')[0]
    $seen[$p] = $true
  }
}
$seen.Keys | Sort-Object | ForEach-Object { Write-Host $_ }
