from django.shortcuts import render

def index(request):
    return render(request=request, template_name="lovefi/index.html")
